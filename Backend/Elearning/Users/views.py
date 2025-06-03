"""User Authentication views"""
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics
from rest_framework.exceptions import NotFound
from .permisssions import IsOwnerorReadoOnly

from django.contrib.auth import authenticate
from django.core.exceptions import PermissionDenied

from .serializers import RegisterUserSerializer, UserProfileSerializer
from .models import UserProfile, User


class RegisterView(APIView):
    """Register a new user"""
    permission_classes = [permissions.AllowAny,]

    def post(self, request):
        """Register a new user and return JWT tokens"""
        serializer = RegisterUserSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            profile = UserProfile.objects.get(user=user)
            profile_data = UserProfileSerializer(profile).data

            return Response({
                'success': 'User registered successfully',
                'user': profile_data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(access_token)
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """Login an already existing user."""
    permission_classes = [permissions.AllowAny, ]

    def post(self, request):
        """Login user and return JWT tokens"""
        username_or_email = request.data.get('username_or_email')
        password = request.data.get('password')

        if not username_or_email or not password: 
            return Response({
                "error": "Username/email and password required."
                }, status=status.HTTP_400_BAD_REQUEST)
        
        if '@' in username_or_email:
            try:
                user_obj = User.objects.get(email=username_or_email)
                username = user_obj.username
            except:
                return Response({'error': 'Invalid Credentials. Check and try again.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            username = username_or_email
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user=user)
            access_token = refresh.access_token

            return Response({
                'success': 'Login successful',
                'user': str(user.username) + '->' + str(user.email),
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(access_token),
                },
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    

class LogoutView(APIView):
    """Logout the user by blacklisting the refresh token"""
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                return Response({"success": "Succesfully logged out."}, status=status.HTTP_200_OK)
            return Response({"error": "Refresh token required."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Single view to handle all profile operations
    - Authenticated users can view any profile.
    - Only profile owners can edit their own profile.
    """

    serializer_class = UserProfileSerializer
    permission_classes = [IsOwnerorReadoOnly]

    def get_object(self):
        """Get profile based on URL parameter or current user."""
        profile_id = self.kwargs.get('profile_id')

        if profile_id:
            try:
                return UserProfile.objects.get(pk=profile_id)
            except UserProfile.DoesNotExist:
                raise NotFound("Profile not found.")
        
        else:
            if self.request.user.is_anonymous:
                raise NotFound("Please specify a username or authenticate to display a profile.")
            try:
                return UserProfile.objects.get(user=self.request.user)
            except UserProfile.DoesNotExist:
                return NotFound("Profile not found")
            


    