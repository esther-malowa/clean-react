from django.contrib import admin
from .models import UserProfile, User

# Register your models here.
@admin.register(User)
class UserModelAdmin(admin.ModelAdmin):
    list_display = ['username', 'first_name', 'last_name', 'email', 'password', 'is_active']
    search_fields = ['first_name', 'last_name', 'email',]

@admin.register(UserProfile)
class UserProfileModelAdmin(admin.ModelAdmin):
    list_display = ['user', 'bio', 'profile_picture']
    search_fields = ['user', 'bio']