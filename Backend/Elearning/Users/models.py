"""UserProfile and related models."""
from django.db import models
from django.contrib.auth.models import  AbstractUser, BaseUserManager
import uuid


class User(AbstractUser):
    """Customized user"""
    id = models.UUIDField(primary_key = True, unique=True, default=uuid.uuid4, editable=False)
    username=models.CharField(max_length=100, unique=True)
    first_name=models.CharField(max_length=100)
    last_name=models.CharField(max_length=100)
    email=models.EmailField(unique=True)
    
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD= 'username'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'email',]


    def __str__(self):
<<<<<<< HEAD
        return self.username
=======
        return self.username + " -> " + self.email
>>>>>>> 0bac392 (commit)

class UserProfile(models.Model):
    """UserProfile that extends the User model."""
    id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='profile')
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', default='profile_pictures/default.png')

    def __str__(self):
        return f"{self.user.username}"

