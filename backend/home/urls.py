from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import HomeHeroViewSet

router = DefaultRouter()
router.register("home-hero", HomeHeroViewSet, basename="home-hero")

urlpatterns = [
    path("", include(router.urls)),
]
