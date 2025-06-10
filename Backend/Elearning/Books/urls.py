from django.urls import path, include

from rest_framework_nested.routers import DefaultRouter, NestedDefaultRouter

from .views import BookViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'', BookViewSet, basename='book')

books_router = NestedDefaultRouter(router, r'', lookup='book')
books_router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(books_router.urls)),
]