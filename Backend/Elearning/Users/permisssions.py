from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework import permissions

class IsOwnerorReadoOnly(BasePermission):
    """Custom permission to only allow owners of the object  to edit it."""
    
    def has_permission(self, request, view):
        """Allow any authenticated user to access the view"""
        return request.user and request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        """Read Permissions for authenticated users only
        Write permissions only for the owner of the profile.
        """
        if request.method in SAFE_METHODS:
            return True
        return obj.user == request.user
    