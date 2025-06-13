"""User Authentication views"""
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.exceptions import NotFound

from django.contrib.auth import authenticate
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.utils.encoding import force_str,force_bytes
from django.core.validators import EmailValidator
from django.core.exceptions import ValidationError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from django.conf import settings
from django.core.mail import EmailMessage
from django.shortcuts import redirect

from .utils import token_generator
from .serializers import RegisterUserSerializer, UserProfileSerializer, send_activation_email, EmailThread
from .models import UserProfile, User
from .permisssions import IsOwnerorReadoOnly


class RegisterView(APIView):
    """Register a new user"""
    permission_classes = [permissions.AllowAny,]

    def post(self, request):
        """Register a new user and return JWT tokens"""
        serializer = RegisterUserSerializer(data = request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            profile = UserProfile.objects.get(user=user)
            profile_data = UserProfileSerializer(profile).data

            return Response({
                'success': 'User registered successfully. Check your email to activate your account.',
                'user': profile_data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(access_token)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """Sign in the user using a username/email and a password"""
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        username_or_email = request.data.get('username_or_email')
        password = request.data.get('password')

        if not username_or_email or not password:
            return Response({"error": "Username/email and password required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            if '@' in username_or_email:
                user = User.objects.get(email__iexact=username_or_email)
            else:
                user = User.objects.get(username__iexact=username_or_email)
        except User.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

        if not user.is_active:
            return Response({'error': 'Account is inactive. Please activate your account.'}, status=status.HTTP_403_FORBIDDEN)

        authenticated_user = authenticate(username=user.username, password=password)

        if authenticated_user:
            refresh = RefreshToken.for_user(authenticated_user)
            return Response({
                'success': 'Login successful',
                'user': f'{user.username} -> {user.email}',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                },
            }, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    """Logout the user by blacklisting the refresh token"""
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response(
                    {"error": "Refresh token required."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"success": "Successfully logged out."}, 
                status=status.HTTP_200_OK
            )
            
        except Exception as e:
            return Response(
                {"error": str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )


class MyProfileView(generics.RetrieveUpdateAPIView):
    """Allow the user to view and edit their own profile."""
    serializer_class = UserProfileSerializer
    permission_classes = [IsOwnerorReadoOnly]

    def get_object(self):
        try:
            return UserProfile.objects.get(user=self.request.user)
        except UserProfile.DoesNotExist:
            raise NotFound("Profile not found.")
        
class UserProfileDetailView(generics.RetrieveAPIView):
    """Allow authenicated users to view another users profile."""
    serializer_class = UserProfileSerializer
    
    def get_object(self):
        profile_id = self.kwargs.get('profile_id')
        try:
            return UserProfile.objects.get(pk=profile_id)
        except UserProfile.DoesNotExist:
            raise NotFound("Profile not found.")
            

class ActivateAccountView(APIView):
    """Activate users account using email"""
    permission_classes=[permissions.AllowAny, ]
    authentication_classes = []
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk = uid)

            # check if token has already been user.
            if not token_generator.check_token(user, token):
                return redirect("http://localhost:5173/login")
            if user.is_active:
                raise redirect("http://localhost:5173/login")
            user.is_active = True
            user.save()
            return redirect("http://localhost:5173/account-activated")
        except Exception as e:
            return Response({"error": f"An unknown error occured {e}"})

class ResendEmailView(APIView):
    """User requests the email be resent."""
    permission_classes=[]

    def post(self, request):
        email = request.data.get("email", "")

        if not email:
            return Response({"email_error":"Email Field cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        if not user:
            return Response({"error": "could not find user."}, status=status.HTTP_200_OK)

        if user.is_active:
            return Response({"email_error": "user is already active. Please log in instead"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            if user:
                send_activation_email(request, user, email)
            return Response({"success": "Email was sent successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"email_error": f"Request for a new link failed, {e}"}, status=status.HTTP_400_BAD_REQUEST)
        


class ForgotPasswordView(APIView):
    """Allows user generate a link they can use to set a new password."""
    permission_classes=[]
    authentication_classes = []
    
    def post(self, request):
        email = request.data.get('email', '')

        try:
            #validate email
            validate_email = EmailValidator()
            validate_email(email)
        except ValidationError as e:
            return Response({'email_error': 'Invalid email address'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        
        try:
            if user:
                uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
                token = PasswordResetTokenGenerator().make_token(user)
                domain = get_current_site(request).domain
                link = reverse('reset-password', kwargs= {
                    'uidb64': uidb64,
                    'token': token
                })

                reset_url = f"{request.scheme}://{domain}{link}"
                email_subject = "Password Reset"
                email_body = f"Hello {user.first_name + " " + user.last_name}\n\n\n Please use the link below to reset your password.\n\n\n{reset_url}"
                email_message = EmailMessage(email_subject, email_body, settings.DEFAULT_FROM_EMAIL, [email])
                EmailThread(email_message).start()
        
            # generic message to prevent exposing legit emails
            return Response({'success': "Please check your email to complete resetting your password"},status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": f"An error occurred while trying to send the message, {e}"}, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """Allow the user to set a new password after confirming their email"""
    permission_classes=[]
    authentication_classes = []
    def post(self, request, uidb64, token):
        password = request.data.get('password', '')
        confirm_password = request.data.get('confirm_password', "")

        if len(password) < 6:
            return Response({"password_error": "Password too short. Use more that six characters."}, status=status.HTTP_400_BAD_REQUEST)
        
        if password != confirm_password:
            return Response({"password_error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))

            user = User.objects.get(pk = uid)

            if not PasswordResetTokenGenerator().check_token(user, token):
                return Response({"invalid_token": "The token was invalid. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(password)
            user.save()
            return Response({"success": "Password changed successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"password_error": "Error occured sending the email."}, status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request, uidb64, token):
        reset_url = f"http://localhost:5173/reset-password?uid={uidb64}&token={token}"
        return redirect(reset_url)



