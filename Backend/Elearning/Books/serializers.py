from rest_framework import serializers
from .models import Book, Review

class BookSerializer(serializers.ModelSerializer):
    added_by = serializers.CharField(source='added_by.username', read_only=True)
    
    class Meta:
        model = Book
        fields = ['book_id', 'added_by', 'genre', 'title', 'author', 'description', 'date_of_publication', 'date_added']
        read_only_fields = ['book_id', 'added_by', 'date_added']
    
    def validate(self, data):
        """Ensure the user does not register a book of the same title and author at the same time."""
        request = self.context.get('request')
        user = request.user
        title = data.get('title', '')
        author = data.get('author', '')

        is_creation = request and request.method == 'POST'

        # Only apply during creation, allow updates
        if is_creation:
            if not title:
                raise serializers.ValidationError("The title field is required.")
        
            if not author:
                raise serializers.ValidationError("The author field is required.")
            
            if Book.objects.filter(added_by=user, title=title, author=author).exists():
                raise serializers.ValidationError("A similar book with the same credentials exists. Please check and try again.")
        
        return data


class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True) 
    title = serializers.CharField(source='book.title', read_only=True)
    
    class Meta:
        model = Review
        fields = ['review_id', 'username', 'title', 'rating', 'review_message']
        read_only_fields = ['title', 'username', 'review_id']
    