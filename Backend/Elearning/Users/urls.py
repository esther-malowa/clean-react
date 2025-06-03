"""Authentication  URLS."""
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, LoginView, LogoutView, UserProfileView

APP_NAME = 'users'

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),

    # Profile paths
    path('profile/', UserProfileView.as_view(), name='current-user-profile'),
    path('profile/<uuid:profile_id>/', UserProfileView.as_view(), name='user-profile'),
]
