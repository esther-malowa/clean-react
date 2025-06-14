from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Book, Review
from rest_framework_simplejwt.tokens import AccessToken

import uuid

User = get_user_model()

class BookAPITests(APITestCase):
    def setUp(self):
        # Create test users
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@test.com',
            first_name='peter',
            last_name='james',
            password='!Testpass123',
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@test.com',
            password='!Testpass123',
            first_name='james',
            last_name='john',
        )
        
        # Create tokens
        self.token1 = str(AccessToken.for_user(self.user1))
        self.token2 = str(AccessToken.for_user(self.user2))
        
        # Create test book - Use valid genre choices from your model
        self.book1 = Book.objects.create(
            title="Existing Book",
            author="Author X",
            genre="NF", 
            description="Test description",
            added_by=self.user1,
            date_of_publication='2025-02-10'
        )
        
        # URLs
        self.book_list_url = reverse('book-list')
        self.book_detail_url = reverse('book-detail', kwargs={'pk': self.book1.pk})
        
    def authenticate(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # --- Book Creation Tests ---
    def test_create_book_authenticated(self):
        """Authenticated user can create a book"""
        self.authenticate(self.token1)
        data = {
            'title': 'New Book',
            'author': 'Author Y',
            'genre': 'FIC', 
            'description': 'New book description',
            'date_of_publication': '2023-10-12'
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Book.objects.count(), 2)
        
    def test_create_book_unauthenticated(self):
        """Unauthenticated user cannot create a book"""
        data = {
            'title': 'New Book',
            'author': 'Author Y',
            'genre': 'BIO',
            'description': 'New book description',
            'date_of_publication': '2023-10-20'  
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_create_duplicate_book(self):
        """Cannot create duplicate book (same title+author by same user)"""
        self.authenticate(self.token1)
        data = {
            'title': 'Existing Book',  
            'author': 'Author X',    
            'genre': 'SCI',
            'description': 'Duplicate test',
            'date_of_publication': '2023-10-20'  # Fixed field name
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('similar book', str(response.data))
        
    def test_create_book_missing_required_fields(self):
        """Cannot create book with missing required fields"""
        self.authenticate(self.token1)
        data = {
            'author': 'Author Y',  # Missing title
            'genre': 'HIS'
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', str(response.data))

    # --- Additional Edge Case Tests ---
    def test_create_book_invalid_genre(self):
        """Cannot create book with invalid genre"""
        self.authenticate(self.token1)
        data = {
            'title': 'Test Book',
            'author': 'Test Author',
            'genre': 'INVALID_GENRE',
            'description': 'Test description',
            'date_of_publication': '2023-10-12'
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('genre', str(response.data))

    def test_create_book_empty_title(self):
        """Cannot create book with empty title"""
        self.authenticate(self.token1)
        data = {
            'title': '',
            'author': 'Test Author',
            'genre': 'AGR',
            'description': 'Test description',
            'date_of_publication': '2023-10-12'
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_book_empty_author(self):
        """Cannot create book with empty author"""
        self.authenticate(self.token1)
        data = {
            'title': 'Test Book',
            'author': '',
            'genre': 'FIC',
            'description': 'Test description',
            'date_of_publication': '2023-10-12'
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_book_invalid_date_format(self):
        """Cannot create book with invalid date format"""
        self.authenticate(self.token1)
        data = {
            'title': 'Test Book',
            'author': 'Test Author',
            'genre': 'NF',
            'description': 'Test description',
            'date_of_publication': 'invalid-date'
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_book_future_date(self):
        """Can create book with future publication date"""
        self.authenticate(self.token1)
        data = {
            'title': 'Future Book',
            'author': 'Future Author',
            'genre': 'BIO',
            'description': 'A book from the future',
            'date_of_publication': '2030-01-01'
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_duplicate_book_different_users(self):
        """Different users can create books with same title and author"""
        # User1 already has "Existing Book" by "Author X"
        self.authenticate(self.token2)
        data = {
            'title': 'Existing Book',
            'author': 'Author X',
            'genre': 'SCI',
            'description': 'Same book by different user',
            'date_of_publication': '2023-10-20'
        }
        response = self.client.post(self.book_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Book.objects.count(), 2)

    def test_create_book_long_title(self):
        """Test with very long title"""
        self.authenticate(self.token1)
        long_title = 'A' * 300  # Assuming max_length constraint
        data = {
            'title': long_title,
            'author': 'Test Author',
            'genre': 'HIS',
            'description': 'Test description',
            'date_of_publication': '2023-10-12'
        }
        response = self.client.post(self.book_list_url, data)
        # This might pass or fail depending on your model's max_length
        # Adjust assertion based on your model constraints

    def test_create_book_without_description(self):
        """Create book without description (if it's optional)"""
        self.authenticate(self.token1)
        data = {
            'title': 'Book Without Description',
            'author': 'Test Author',
            'genre': 'AGR',
            'date_of_publication': '2023-10-12'
        }
        response = self.client.post(self.book_list_url, data)
        # Adjust assertion based on whether description is required
        if response.status_code == status.HTTP_201_CREATED:
            self.assertEqual(Book.objects.count(), 2)
        else:
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    # --- Book Update/Delete Tests ---
    def test_update_book_owner(self):
        """Owner can update their book"""
        self.authenticate(self.token1)
        data = {
            'title': 'Updated Title',
            'genre': 'HIS', 
            'date_of_publication': '2025-02-10'
        }
        response = self.client.patch(self.book_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.book1.refresh_from_db()
        self.assertEqual(self.book1.title, 'Updated Title')
        
    def test_update_book_non_owner(self):
        """Non-owner cannot update book"""
        self.authenticate(self.token2)
        data = {'title': 'Hacked Title'}
        response = self.client.patch(self.book_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_book_unauthenticated(self):
        """Unauthenticated user cannot update book"""
        data = {'title': 'Unauthorized Update'}
        response = self.client.patch(self.book_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_book_partial_fields(self):
        """Test partial update of book fields"""
        self.authenticate(self.token1)
        original_author = self.book1.author
        data = {'description': 'Updated description only'}
        response = self.client.patch(self.book_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.book1.refresh_from_db()
        self.assertEqual(self.book1.description, 'Updated description only')
        self.assertEqual(self.book1.author, original_author)  # Should remain unchanged
        
    def test_delete_book_owner(self):
        """Owner can delete their book"""
        self.authenticate(self.token1)
        response = self.client.delete(self.book_detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Book.objects.count(), 0)
        
    def test_delete_book_non_owner(self):
        """Non-owner cannot delete book"""
        self.authenticate(self.token2)
        response = self.client.delete(self.book_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Book.objects.count(), 1)

    def test_delete_book_unauthenticated(self):
        """Unauthenticated user cannot delete book"""
        response = self.client.delete(self.book_detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Book.objects.count(), 1)

    def test_delete_nonexistent_book(self):
        """Cannot delete non-existent book"""
        self.authenticate(self.token1)
        nonexistent_url = reverse('book-detail', kwargs={'pk': 9999})
        response = self.client.delete(nonexistent_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # --- Book Retrieval Tests ---
    def test_list_books_authenticated(self):
        """Authenticated user can list all books"""
        self.authenticate(self.token1)
        response = self.client.get(self.book_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_list_books_unauthenticated(self):
        """Unauthenticated user can list all books (read-only)"""
        response = self.client.get(self.book_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_retrieve_book_detail(self):
        """Anyone can retrieve book details"""
        response = self.client.get(self.book_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Existing Book')


class ReviewAPITests(APITestCase):
    def setUp(self):
        # Create test users
        self.owner = User.objects.create_user(
            username='owner',
            first_name='owner',
            last_name='owner',
            email='owner@test.com',
            password='!Testpass123'
        )
        self.reviewer = User.objects.create_user(
            username='reviewer',
            first_name='reviewer',
            last_name='reviewer',
            email='reviewer@test.com',
            password='!Testpass123'
        )
        self.other_user = User.objects.create_user(
            username='other',
            first_name='other',
            last_name='other',
            email='other@test.com',
            password='!Testpass123'
        )
        
        # Create tokens
        self.owner_token = str(AccessToken.for_user(self.owner))
        self.reviewer_token = str(AccessToken.for_user(self.reviewer))
        self.other_token = str(AccessToken.for_user(self.other_user))
        
        # Create test book
        self.book = Book.objects.create(
            title="Book Title",
            author="Author Z",
            genre="AGR",
            description="Test book",
            added_by=self.owner,
            date_of_publication='2025-02-10'
        )
        
        # Create test review
        self.review = Review.objects.create(
            user=self.reviewer,
            book=self.book,
            rating=4,
            review_message="Good book"
        )
        
        # URLs
        self.review_list_url = reverse('review-list', kwargs={'book_pk': self.book.pk})
        self.review_detail_url = reverse('review-detail', kwargs={'book_pk': self.book.pk, 'pk': self.review.pk})
        
    def authenticate(self, token):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
    # --- Review Creation Tests ---
    def test_create_review_authenticated(self):
        """Authenticated user can create review"""
        self.authenticate(self.other_token)
        data = {
            'rating': 5,
            'review_message': 'Excellent book!'
        }
        response = self.client.post(self.review_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Review.objects.count(), 2)
        
    def test_create_review_unauthenticated(self):
        """Unauthenticated user cannot create review"""
        data = {
            'rating': 5,
            'review_message': 'Excellent book!'
        }
        response = self.client.post(self.review_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
    def test_create_duplicate_review(self):
        """User cannot create multiple reviews for same book"""
        self.authenticate(self.reviewer_token)
        data = {
            'rating': 3,
            'review_message': 'Duplicate review'
        }
        response = self.client.post(self.review_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('cannot review a book twice', str(response.data))
        
    def test_create_review_own_book(self):
        """User cannot review their own book"""
        self.authenticate(self.owner_token)
        data = {
            'rating': 5,
            'review_message': 'I love my own book!'
        }
        response = self.client.post(self.review_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('cannot review your own book', str(response.data))

    # --- Additional Review Edge Cases ---
    def test_create_review_invalid_rating_high(self):
        """Cannot create review with rating above maximum"""
        self.authenticate(self.other_token)
        data = {
            'rating': 6,  # Assuming max rating is 5
            'review_message': 'Over the top!'
        }
        response = self.client.post(self.review_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_review_invalid_rating_low(self):
        """Cannot create review with rating below minimum"""
        self.authenticate(self.other_token)
        data = {
            'rating': 0,  # Assuming min rating is 1
            'review_message': 'Terrible!'
        }
        response = self.client.post(self.review_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_review_missing_rating(self):
        """Cannot create review without rating"""
        self.authenticate(self.other_token)
        data = {
            'review_message': 'Good book but no rating!'
        }
        response = self.client.post(self.review_list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_review_empty_message(self):
        """Can create review with empty message (if allowed)"""
        self.authenticate(self.other_token)
        data = {
            'rating': 4,
            'review_message': ''
        }
        response = self.client.post(self.review_list_url, data)
        # Adjust based on your model requirements
        if response.status_code == status.HTTP_201_CREATED:
            self.assertEqual(Review.objects.count(), 2)

    def test_create_review_nonexistent_book(self):
        """Cannot create review for non-existent book"""
        self.authenticate(self.other_token)
        nonexistent_url = reverse('review-list', kwargs={'book_pk': uuid.uuid4()})
        data = {
            'rating': 5,
            'review_message': 'Review for ghost book'
        }
        response = self.client.post(nonexistent_url, data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    # --- Review Update/Delete Tests ---
    def test_update_review_owner(self):
        """Review owner can update their review"""
        self.authenticate(self.reviewer_token)
        data = {'rating': 2}
        response = self.client.patch(self.review_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.review.refresh_from_db()
        self.assertEqual(self.review.rating, 2)
        
    def test_update_review_non_owner(self):
        """Non-owner cannot update review"""
        self.authenticate(self.other_token)
        data = {'rating': 1}
        response = self.client.patch(self.review_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_review_unauthenticated(self):
        """Unauthenticated user cannot update review"""
        data = {'rating': 1}
        response = self.client.patch(self.review_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_review_partial_fields(self):
        """Test partial update of review fields"""
        self.authenticate(self.reviewer_token)
        original_rating = self.review.rating
        data = {'review_message': 'Updated message only'}
        response = self.client.patch(self.review_detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.review.refresh_from_db()
        self.assertEqual(self.review.review_message, 'Updated message only')
        self.assertEqual(self.review.rating, original_rating)
        
    def test_delete_review_owner(self):
        """Review owner can delete their review"""
        self.authenticate(self.reviewer_token)
        response = self.client.delete(self.review_detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Review.objects.count(), 0)
        
    def test_delete_review_non_owner(self):
        """Non-owner cannot delete review"""
        self.authenticate(self.other_token)
        response = self.client.delete(self.review_detail_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Review.objects.count(), 1)

    def test_delete_review_unauthenticated(self):
        """Unauthenticated user cannot delete review"""
        response = self.client.delete(self.review_detail_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Review.objects.count(), 1)

    def test_delete_nonexistent_review(self):
        """Cannot delete non-existent review"""
        self.authenticate(self.reviewer_token)
        nonexistent_url = reverse('review-detail', kwargs={'book_pk': self.book.pk, 'pk': 9999})
        response = self.client.delete(nonexistent_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # --- Review Retrieval Tests ---
    def test_list_reviews_for_book(self):
        """Anyone can list reviews for a book"""
        response = self.client.get(self.review_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_review_detail(self):
        """Anyone can retrieve review details"""
        response = self.client.get(self.review_detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['rating'], 4)

    def test_book_owner_can_see_reviews(self):
        """Book owner can see all reviews for their book"""
        self.authenticate(self.owner_token)
        response = self.client.get(self.review_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)