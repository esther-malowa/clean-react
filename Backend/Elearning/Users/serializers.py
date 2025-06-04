"""User related serializers."""
import re

from rest_framework import serializers


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
            raise serializers.ValidationError("User with that email already exists. User another email or login")
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
        user = User.objects.create_user(password=password, **validated_data)

        UserProfile.objects.create(user = user)
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

