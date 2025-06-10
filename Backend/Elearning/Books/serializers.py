from rest_framework import serializers
from .models import Book, Review

class BookSerializer(serializers.ModelSerializer):
    added_by = serializers.CharField(source='added_by.username',read_only = True)
    class Meta:
        model = Book
        fields = ['book_id', 'added_by','genre','title', 'author', 'description', 'date_of_publication', 'date_added']
        read_only_fields  = ['book_id', 'added_by', 'date_added']
    
    def validate(self, data):
        """Ensure the user does not register
        a book of the same title, and author at the same time."""
        request = self.context.get('request')
        user = request.user
        title = data.get('title', '')
        author = data.get('author', '')

        if not title:
            raise serializers.ValidationError("The title field is required.")
        
        if not author:
            raise serializers.ValidationError("The authors field is required.")
        
        if self.instance is None: # applied only during creation but allow updates.
            if Book.objects.filter(added_by = user, title=title ,author = author).exists():
                raise serializers.ValidationError("A similar book with the same credentials exist. Please check and try again.")
        
        return data

class ReviewSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source = 'user.username', read_only=True) 
    title = serializers.CharField(source = 'book.title', read_only = True)
    class Meta:
        model = Review
        fields = ['username', 'title', 'rating', 'review_message']
    
    def validate(self, data):
        """Ensure a user does not submit more than one review for a single book"""
        request = self.context.get('request')
        user = request.user
        book = data.get('book')

        if Review.objects.filter(user=user, book=book).exists():
            raise serializers.ValidationError("You have reviewed this book. Please update your review instead.")
        return data