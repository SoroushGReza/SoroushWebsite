from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EducationItemViewSet

router = DefaultRouter()
router.register("education-items", EducationItemViewSet, basename="education-item")

urlpatterns = [
    path("", include(router.urls)),
]
