from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError

from .models import Book, Review
from .serializers import ReviewSerializer, BookSerializer
from .permissions import IsOwnerOrReadOnly


class BookViewSet(viewsets.ModelViewSet):
    """Create, Update, retrieve and delete books"""
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]
    
    def perform_create(self, serializer):
        serializer.save(added_by = self.request.user)


class ReviewViewSet(viewsets.ModelViewSet):
    """Create, update, retrieve, and delete books"""
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        book = Book.objects.get(book_id = self.kwargs['book_pk'])
        # prevent reviewing own book.
        if book.added_by == self.request.user:
            raise PermissionDenied("You cannot review your own book.")
        
        #prevent more than one review per book per user
        if Review.objects.filter(user = self.request.user, book = book).exists():
            raise ValidationError("You cannot review a book twice. Please update your previous review.")

        serializer.save(user = self.request.user, book=book)        
    
    def get_queryset(self):
        return Review.objects.filter(book__book_id = self.kwargs['book_pk'])
    
