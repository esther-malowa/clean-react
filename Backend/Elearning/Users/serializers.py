"""User related serializers."""
import re
<<<<<<< HEAD
import threading

from rest_framework import serializers

from django.conf import settings
from django.core.mail import EmailMessage
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.sites.shortcuts import get_current_site
from django.urls import reverse
from .utils import token_generator

=======

from rest_framework import serializers

>>>>>>> 0bac392 (commit)

from .models import UserProfile, User

class RegisterUserSerializer(serializers.ModelSerializer):
    """Serialize user for registration"""
    password = serializers.CharField(write_only= True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    # explicitly define the fields to be required.
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)


    class Meta:
        """Define serialization model and fields."""
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'confirm_password']

    def validate_email(self, value):
        """Check if email already registered."""
        if User.objects.filter(email=value).exists():
<<<<<<< HEAD
            raise serializers.ValidationError("User with that email already exists. Use another email or login")
=======
            raise serializers.ValidationError("User with that email already exists. User another email or login")
>>>>>>> 0bac392 (commit)
        return value
    
    def validate_username(self, value):
        """Check if username already taken."""
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists. Use another username or login")
        return value
    
    def validate(self, data):
        """
        Validates a password against the following rules:
        - At least 8 characters long
        - Contains at least one uppercase letter
        - Contains at least one lowercase letter
        - Contains at least one digit
        - Contains at least one special character (@$!%*?&)

        Raises:
            serializers.ValidationError: If the password does not meet the criteria.
        """

        password = data.get('password')
        confirm_password = data.get('confirm_password')

        if password != confirm_password:
            raise serializers.ValidationError("Passwords do not match.")
        
        # validate length and minimum requirements.
        password_pattern =  r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$'
        if not re.match(password_pattern, password):
            raise serializers.ValidationError( "Password must be at least 8 characters long, include uppercase, lowercase, digit, and special character.")
        
        return data
   
    def create(self, validated_data):
        """Create user and the user profile."""
        validated_data.pop('confirm_password', None)

        password = validated_data.pop('password')
<<<<<<< HEAD
        user = User.objects.create_user(is_active=False ,password=password, **validated_data)

        UserProfile.objects.create(user = user)
        
        # send verification email
        send_activation_email(self.context.get('request'), user, user.email)

=======
        user = User.objects.create_user(password=password, **validated_data)

        UserProfile.objects.create(user = user)
>>>>>>> 0bac392 (commit)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serialize the userprofile."""
    username = serializers.CharField(source  ='user.username', read_only=True)
    email = serializers.EmailField(source  ='user.email', read_only=True)
    first_name = serializers.CharField(source  ='user.first_name', read_only=True)
    last_name = serializers.CharField(source  ='user.last_name', read_only=True)


    class Meta:
        """Define model and fields for user profile serialization"""
        model = UserProfile
        fields = ['username', 'email', 'first_name', 'last_name', 'bio', 'profile_picture']

<<<<<<< HEAD

class EmailThread(threading.Thread):
    """Speed up the sending of an email"""
    def __init__(self, email):
        self.email = email
        threading.Thread.__init__(self)
    
    def run(self):
        self.email.send(fail_silently=False)
    
def send_activation_email(request, user, email):
    try:
        if not request:
            raise serializers.ValidationError('Request object waas required to send email.')
        
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        try:
            domain = get_current_site(request).domain
        except Exception:
            raise serializers.ValidationError("Failed to fetch your domain.")
        
        link = reverse('activate-account', kwargs= {

            'uidb64': uidb64,
            'token': token,
        })

        activate_url = f"{request.scheme}://{domain}{link}"
        email_subject = 'Activate your account.'
        email_body = f"Hello {user.first_name + " " + user.last_name}\n\n\n Please activate your account using the link below\n\n{activate_url}"
        email_message = EmailMessage(email_subject, email_body, settings.DEFAULT_FROM_EMAIL, [email])
        EmailThread(email_message).start()
    except Exception as e:
        print(f"Email error: ", e)
        raise serializers.ValidationError('Email sending failed. Please try again or contact us if the problem persists.')

=======
>>>>>>> 0bac392 (commit)
