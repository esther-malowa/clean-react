from rest_framework import viewsets, permissions
from django.core.exceptions import PermissionDenied

from .models import Book, Review
from .serializers import ReviewSerializer, BookSerializer

class BookViewSet(viewsets.ModelViewSet):
    """Create, Update, retrieve and delete books"""
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(added_by = self.request.user)
    
    def get_object(self):
        obj = super().get_object()
        if self.request.method in ['PUT', 'PATCH', 'DELETE'] and obj.added_by != self.request.user:
            raise PermissionDenied("You do not own this book")
        return obj


class ReviewViewSet(viewsets.ModelViewSet):
    """Create, update, retrieve, and delete books"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

