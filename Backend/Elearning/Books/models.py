import uuid

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

from Users.models import User

GENRE = [
    ('FIC', 'Fiction'),
    ('NF', 'Non-fiction'),
    ('BIO', 'Biography'),
    ('SCI', 'Science'),
    ('HIS', 'History'),
    ('AGR', 'Agriculture')
]

# Create your models here.
class Book(models.Model):
    book_id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    description = models.TextField()
    genre = models.CharField(max_length=100, choices=GENRE, default='AGR')
    date_of_publication = models.DateField()
    date_added = models.DateField(auto_now_add=True)
    added_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name='books')

    class Meta:
        ordering = ['-date_added']
        unique_together = ['added_by', 'title', 'author']
    
    def __str__(self):
        return self.title
    

class Review(models.Model):
    review_id = models.UUIDField(primary_key=True, unique=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='reviews')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='reviews')
    rating = models.SmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_message = models.TextField()

    class Meta:
        unique_together = ['user', 'book']
    
    def __str__(self):
        return f"{self.book.title} rated at {self.rating}/5"

