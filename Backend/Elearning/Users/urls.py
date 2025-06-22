"""Authentication  URLS."""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, LogoutView, UserProfileDetailView, MyProfileView, ActivateAccountView, ResendEmailView, ResetPasswordView, ForgotPasswordView

APP_NAME = 'users'

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('activate_account/<uidb64>/<token>', ActivateAccountView.as_view(), name='activate-account'),
    path('resend_email/', ResendEmailView.as_view(), name='resend-email'),
    path('forgot_password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset_password/<uidb64>/<token>/', ResetPasswordView.as_view(), name='reset-password'),

    # Profile paths
    path('profile/me/', MyProfileView.as_view(), name='my-profile'),
    path('profile/<uuid:profile_id>/', UserProfileDetailView.as_view(), name='user-profile'),
]
