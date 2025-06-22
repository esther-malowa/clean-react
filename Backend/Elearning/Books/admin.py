from django.contrib import admin
from .models import Book, Review

# Register your models here.
@admin.register(Review)
class ReviewModelAdmin(admin.ModelAdmin):
    list_display = ['review_id', 'user', 'book', 'rating', 'review_message']
    list_filter = ['user', 'book', 'rating']
    search_fields = ['review_message']

@admin.register(Book)
class BookModelAdmin(admin.ModelAdmin):
    list_display = ['book_id', 'added_by', 'title', 'author', 'description']
    list_filter = ['genre']
    search_fields = ['description', 'author', 'title']