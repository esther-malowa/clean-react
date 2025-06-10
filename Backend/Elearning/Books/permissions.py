from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsOwnerOrReadOnly(BasePermission):
    """
    Custom permission to only allow owners  of an object to edit/delete it.
    Assumes the object has an added_by or user field tied to the request user.
    """
    def has_object_permission(self, request, view, obj):
        # SAFE METHODS: GET, HEAD AND OPTION
        if request.method in SAFE_METHODS:
            return True
        
        owner = getattr(obj, 'added_by', None) or getattr(obj, 'user', None)
        return owner == request.user

