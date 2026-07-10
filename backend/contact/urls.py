from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ContactMessageViewSet, ContactProfileViewSet

router = DefaultRouter()
router.register("contact-profile", ContactProfileViewSet, basename="contact-profile")
router.register("contact-messages", ContactMessageViewSet, basename="contact-message")

urlpatterns = [
    path("", include(router.urls)),
]
