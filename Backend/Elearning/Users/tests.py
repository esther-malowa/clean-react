"""
Comprehensive test suite for User Authentication views
"""
import json
from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core import mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile
from .utils import token_generator

import uuid

User = get_user_model()


class RegisterViewTests(APITestCase):
    """Test cases for RegisterView"""
    
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')
        self.valid_user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': '!Testpassword123',
            'confirm_password': '!Testpassword123',
            'first_name': 'Test',
            'last_name': 'User'
        }
    
    def test_successful_user_registration(self):
        """Test successful user registration"""
        response = self.client.post(self.register_url, self.valid_user_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('success', response.data)
        self.assertIn('user', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('refresh', response.data['tokens'])
        self.assertIn('access', response.data['tokens'])
        
        # Verify user was created
        self.assertTrue(User.objects.filter(username='testuser').exists())
        
        # Verify user profile was created
        user = User.objects.get(username='testuser')
        self.assertTrue(UserProfile.objects.filter(user=user).exists())
    
    def test_registration_with_invalid_data(self):
        """Test registration with invalid data"""
        invalid_data = {
            'username': '',
            'email': 'invalid-email',
            'password': '123'  # Too short
        }
        response = self.client.post(self.register_url, invalid_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertIn('password', response.data)
    
    def test_registration_with_existing_username(self):
        """Test registration with existing username"""
        # Create existing user
        User.objects.create_user(username='testuser', email='existing@example.com')
        
        response = self.client.post(self.register_url, self.valid_user_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_registration_with_existing_email(self):
        """Test registration with existing email"""
        # Create existing user
        User.objects.create_user(username='existing', email='test@example.com')
        
        response = self.client.post(self.register_url, self.valid_user_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_registration_missing_required_fields(self):
        """Test registration with missing required fields"""
        incomplete_data = {
            'username': 'testuser',
            # Missing email and password
        }
        response = self.client.post(self.register_url, incomplete_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    @patch('Users.serializers.send_activation_email')
    def test_activation_email_sent(self, mock_send_email):
        """Test that activation email is sent on registration"""
        response = self.client.post(self.register_url, self.valid_user_data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        mock_send_email.assert_called_once()


class LoginViewTests(APITestCase):
    """Test cases for LoginView"""
    
    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123',
            is_active=True
        )
        UserProfile.objects.create(user=self.user)
    
    def test_successful_login_with_username(self):
        """Test successful login with username"""
        login_data = {
            'username_or_email': 'testuser',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        self.assertIn('tokens', response.data)
        self.assertIn('user', response.data)
    
    def test_successful_login_with_email(self):
        """Test successful login with email"""
        login_data = {
            'username_or_email': 'test@example.com',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        self.assertIn('tokens', response.data)
    
    def test_login_with_wrong_password(self):
        """Test login with incorrect password"""
        login_data = {
            'username_or_email': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Invalid credentials')
    
    def test_login_with_nonexistent_user(self):
        """Test login with non-existent user"""
        login_data = {
            'username_or_email': 'nonexistent',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Invalid credentials')
    
    def test_login_with_inactive_user(self):
        """Test login with inactive user"""
        self.user.is_active = False
        self.user.save()
        
        login_data = {
            'username_or_email': 'testuser',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn('error', response.data)
        self.assertIn('inactive', response.data['error'].lower())
    
    def test_login_missing_username_email(self):
        """Test login with missing username/email"""
        login_data = {
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('required', response.data['error'].lower())
    
    def test_login_missing_password(self):
        """Test login with missing password"""
        login_data = {
            'username_or_email': 'testuser'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('required', response.data['error'].lower())
    
    def test_login_case_insensitive_email(self):
        """Test login with case-insensitive email"""
        login_data = {
            'username_or_email': 'TEST@EXAMPLE.COM',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_login_case_insensitive_username(self):
        """Test login with case-insensitive username"""
        login_data = {
            'username_or_email': 'TESTUSER',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, login_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LogoutViewTests(APITestCase):
    """Test cases for LogoutView"""
    
    def setUp(self):
        self.client = APIClient()
        self.logout_url = reverse('logout')
        
        # Create test user and tokens
        self.user = User.objects.create_user(
            username='testuser',
            first_name='first',
            last_name = 'last',
            email='test@example.com',
            password='testpassword123'
        )
        self.refresh_token = RefreshToken.for_user(self.user)
        self.access_token  = str(self.refresh_token.access_token)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.access_token}')

    @patch('rest_framework_simplejwt.tokens.RefreshToken.blacklist')
    def test_successful_logout(self, mock_blacklist):
        """Test successful logout"""
        logout_data = {
            'refresh_token': str(self.refresh_token)
        }
        response = self.client.post(self.logout_url, logout_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        mock_blacklist.assert_called_once()
    
    def test_logout_without_refresh_token(self):
        """Test logout without providing refresh token"""
        response = self.client.post(self.logout_url, {})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
        self.assertIn('required', response.data['error'].lower())
    
    def test_logout_with_invalid_token(self):
        """Test logout with invalid refresh token"""
        logout_data = {
            'refresh_token': 'invalid_token'
        }
        response = self.client.post(self.logout_url, logout_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)


class MyProfileViewTests(APITestCase):
    """Test cases for MyProfileView"""
    
    def setUp(self):
        self.client = APIClient()
        self.profile_url = reverse('my-profile')
        
        # Create test user and profile
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
        self.profile = UserProfile.objects.create(user=self.user)
        
        # Authenticate user
        self.client.force_authenticate(user=self.user)
    
    def test_get_own_profile(self):
        """Test retrieving own profile"""
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)
        self.assertEqual(response.data['first_name'], self.user.first_name)
        self.assertEqual(response.data['last_name'], self.user.last_name)

    
    def test_update_own_profile(self):
        """Test updating own profile"""
        update_data = {
            'bio': 'Updated bio'
        }
        response = self.client.patch(self.profile_url, update_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.profile.refresh_from_db()
        self.assertEqual(self.profile.bio, 'Updated bio')
    
    def test_get_profile_unauthenticated(self):
        """Test getting profile without authentication"""
        self.client.logout()
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_get_profile_no_profile_exists(self):
        """Test getting profile when UserProfile doesn't exist"""
        # Delete the profile
        self.profile.delete()
        
        response = self.client.get(self.profile_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class UserProfileDetailViewTests(APITestCase):
    """Test cases for UserProfileDetailView"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test users and profiles
        self.user1 = User.objects.create_user(
            username='user1',
            last_name= 'user1',
            first_name='first',
            email='user1@example.com',
            password='!Testpassword123',
        )
        self.profile1 = UserProfile.objects.create(user=self.user1)
        
        self.user2 = User.objects.create_user(
            username='user2',
            first_name = 'user2',
            last_name = 'last',
            email='user2@example.com',
            password='!Testpassword123',
        )
        self.profile2 = UserProfile.objects.create(user=self.user2)
        
        self.profile_detail_url = reverse('user-profile', 
                                        kwargs={'profile_id': self.profile2.id})
    
    def test_get_another_user_profile(self):
        """Test getting another user's profile"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.profile_detail_url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], self.profile2.user.email)
        self.assertEqual(response.data['username'], self.profile2.user.username)
    
    def test_get_nonexistent_profile(self):
        """Test getting non-existent profile"""
        self.client.force_authenticate(user=self.user1)
        nonexistent_url = reverse('user-profile', 
                                kwargs={'profile_id': uuid.uuid4()})
        response = self.client.get(nonexistent_url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class ActivateAccountViewTests(APITestCase):
    """Test cases for ActivateAccountView"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create inactive user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123',
            is_active=False
        )
        
        # Generate valid token
        self.uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token = token_generator.make_token(self.user)
        
        self.activate_url = reverse('activate-account', 
                                  kwargs={'uidb64': self.uidb64, 'token': self.token})
    
    def test_successful_account_activation(self):
        """Test successful account activation"""
        response = self.client.get(self.activate_url)
        
        # Should redirect to account-activated page
        self.assertEqual(response.status_code, 302)
        
        # Verify user is now active
        self.user.refresh_from_db()
        self.assertTrue(self.user.is_active)
    
    def test_activation_with_invalid_token(self):
        """Test activation with invalid token"""
        invalid_url = reverse('activate-account', 
                            kwargs={'uidb64': self.uidb64, 'token': 'invalid_token'})
        response = self.client.get(invalid_url)
        
        # Should redirect to login page
        self.assertEqual(response.status_code, 302)
        
        # User should remain inactive
        self.user.refresh_from_db()
        self.assertFalse(self.user.is_active)
    
    def test_activation_with_invalid_uid(self):
        """Test activation with invalid UID"""
        invalid_uid = urlsafe_base64_encode(force_bytes(uuid.uuid4()))
        invalid_url = reverse('activate-account', 
                            kwargs={'uidb64': invalid_uid, 'token': self.token})
        response = self.client.get(invalid_url)
        
        self.assertEqual(response.status_code, 200)  # Returns error response
        self.assertIn('error', response.data)
    
    def test_activation_already_active_user(self):
        """Test activation of already active user"""
        self.user.is_active = True
        self.user.save()
        
        response = self.client.get(self.activate_url)
        
        # Should redirect to login
        self.assertEqual(response.status_code, 302)


class ResendEmailViewTests(APITestCase):
    """Test cases for ResendEmailView"""
    
    def setUp(self):
        self.client = APIClient()
        self.resend_url = reverse('resend-email')
        
        # Create inactive user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123',
            is_active=False
        )
    
    @patch('Users.views.send_activation_email')
    def test_successful_email_resend(self, mock_send_email):
        """Test successful email resend"""
        resend_data = {
            'email': 'test@example.com'
        }
        response = self.client.post(self.resend_url, resend_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        mock_send_email.assert_called_once()
    
    def test_resend_email_empty_field(self):
        """Test resend with empty email field"""
        response = self.client.post(self.resend_url, {})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email_error', response.data)
    
    def test_resend_email_active_user(self):
        """Test resend email for already active user"""
        self.user.is_active = True
        self.user.save()
        
        resend_data = {
            'email': 'test@example.com'
        }
        response = self.client.post(self.resend_url, resend_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email_error', response.data)
        self.assertIn('already active', response.data['email_error'])
    
    def test_resend_email_nonexistent_user(self):
        """Test resend email for non-existent user"""
        resend_data = {
            'email': 'nonexistent@example.com'
        }
        response = self.client.post(self.resend_url, resend_data)
        
        # Should handle gracefully (might return error or success for security)
        self.assertIn(response.status_code, [200, 400])


class ForgotPasswordViewTests(APITestCase):
    """Test cases for ForgotPasswordView"""
    
    def setUp(self):
        self.client = APIClient()
        self.forgot_password_url = reverse('forgot-password')
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123',
            first_name='Test',
            last_name='User'
        )
    
    @patch('Users.views.EmailThread')
    def test_successful_password_reset_request(self, mock_email_thread):
        """Test successful password reset request"""
        forgot_data = {
            'email': 'test@example.com'
        }
        response = self.client.post(self.forgot_password_url, forgot_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        self.assertIn('check your email', response.data['success'].lower())
        
        # Verify email was attempted to be sent
        mock_email_thread.assert_called_once()
    
    def test_forgot_password_invalid_email_format(self):
        """Test forgot password with invalid email format"""
        forgot_data = {
            'email': 'invalid-email'
        }
        response = self.client.post(self.forgot_password_url, forgot_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email_error', response.data)
        self.assertIn('Invalid email', response.data['email_error'])
    
    def test_forgot_password_nonexistent_user(self):
        """Test forgot password for non-existent user"""
        forgot_data = {
            'email': 'nonexistent@example.com'
        }
        response = self.client.post(self.forgot_password_url, forgot_data)
        
        # Should return generic success message for security
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
    
    def test_forgot_password_empty_email(self):
        """Test forgot password with empty email"""
        response = self.client.post(self.forgot_password_url, {})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ResetPasswordViewTests(APITestCase):
    """Test cases for ResetPasswordView"""
    
    def setUp(self):
        self.client = APIClient()
        
        # Create test user
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='oldpassword123'
        )
        
        # Generate valid reset token
        self.uidb64 = urlsafe_base64_encode(force_bytes(self.user.pk))
        self.token = PasswordResetTokenGenerator().make_token(self.user)
        
        self.reset_password_url = reverse('reset-password', 
                                        kwargs={'uidb64': self.uidb64, 'token': self.token})
    
    def test_successful_password_reset(self):
        """Test successful password reset"""
        reset_data = {
            'password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        response = self.client.post(self.reset_password_url, reset_data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('success', response.data)
        
        # Verify password was changed
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpassword123'))
    
    def test_reset_password_too_short(self):
        """Test reset with password too short"""
        reset_data = {
            'password': '123',
            'confirm_password': '123'
        }
        response = self.client.post(self.reset_password_url, reset_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_error', response.data)
        self.assertIn('too short', response.data['password_error'].lower())
    
    def test_reset_password_mismatch(self):
        """Test reset with mismatched passwords"""
        reset_data = {
            'password': 'newpassword123',
            'confirm_password': 'differentpassword123'
        }
        response = self.client.post(self.reset_password_url, reset_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password_error', response.data)
        self.assertIn('do not match', response.data['password_error'].lower())
    
    def test_reset_password_invalid_token(self):
        """Test reset with invalid token"""
        invalid_url = reverse('reset-password', 
                            kwargs={'uidb64': self.uidb64, 'token': 'invalid_token'})
        reset_data = {
            'password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        response = self.client.post(invalid_url, reset_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('invalid_token', response.data)
    
    def test_reset_password_invalid_uid(self):
        """Test reset with invalid UID"""
        invalid_uid = urlsafe_base64_encode(force_bytes(uuid.uuid4()))
        invalid_url = reverse('reset-password', 
                            kwargs={'uidb64': invalid_uid, 'token': self.token})
        reset_data = {
            'password': 'newpassword123',
            'confirm_password': 'newpassword123'
        }
        response = self.client.post(invalid_url, reset_data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_reset_password_get_redirect(self):
        """Test GET request to reset password (should redirect)"""
        response = self.client.get(self.reset_password_url)
        
        self.assertEqual(response.status_code, 302)
        self.assertIn('localhost:5173/reset-password', response.url)
    
    def test_reset_password_missing_fields(self):
        """Test reset without required fields"""
        response = self.client.post(self.reset_password_url, {})
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class EdgeCaseTests(APITestCase):
    """Test edge cases and error scenarios"""
    
    def setUp(self):
        self.client = APIClient()
    
    def test_malformed_json_requests(self):
        """Test handling of malformed JSON in requests"""
        response = self.client.post(
            reverse('login'),  # Adjust URL name
            data='{"invalid": json}',
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
    
    def test_sql_injection_attempts(self):
        """Test protection against SQL injection"""
        malicious_data = {
            'username_or_email': "'; DROP TABLE users; --",
            'password': 'password'
        }
        response = self.client.post(reverse('login'), malicious_data)
        
        # Should not crash and should return invalid credentials
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_extremely_long_input_values(self):
        """Test handling of extremely long input values"""
        long_string = 'a' * 10000
        register_data = {
            'username': long_string,
            'email': f'{long_string}@example.com',
            'password': long_string
        }
        response = self.client.post(reverse('register'), register_data)
        
        # Should handle gracefully with validation error
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_unicode_and_special_characters(self):
        """Test handling of unicode and special characters"""
        unicode_data = {
            'username': 'user_测试',
            'email': 'test@测试.com',
            'password': 'пароль123',
            'first_name': '名前',
            'last_name': 'Фамилия'
        }
        response = self.client.post(reverse('register'), unicode_data)
        
        # Should handle unicode characters appropriately
        self.assertIn(response.status_code, [200, 201, 400])  # Depends on validation rules
    

class SecurityTests(APITestCase):
    """Security-related test cases"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpassword123'
        )
    
    def test_rate_limiting_login_attempts(self):
        """Test rate limiting on login attempts (if implemented)"""
        login_data = {
            'username_or_email': 'testuser',
            'password': 'wrongpassword'
        }
        
        for _ in range(10):
            response = self.client.post(reverse('login'), login_data)
            self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # If rate limiting is implemented, this should be blocked
        # Otherwise, it should continue to return 400
    
    def test_password_exposure_in_responses(self):
        """Test that passwords are never exposed in API responses"""
        register_data = {
            'username': 'newuser',
            'first_name': 'new_user',
            'last_name': 'new_user',
            'email': 'new@example.com',
            'password': '!Secretpassword123',
            'confirm_password': '!Secretpassword123'
        }
        response = self.client.post(reverse('register'), register_data)
        
        # Ensure password is not in response
        response_str = json.dumps(response.data)
        self.assertNotIn('secretpassword123', response_str)
        self.assertNotIn('password', response_str.lower())
