from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .views import HomePostViewSet, api_home

router = SimpleRouter()
router.register("home-posts", HomePostViewSet, basename="home-post")

urlpatterns = [
    path("", api_home, name="api-home"),
    path("", include(router.urls)),
]
