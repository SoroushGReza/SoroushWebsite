from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .auth_views import AdminLoginView, AdminLogoutView, CsrfTokenView, CurrentUserView
from .views import HomePostViewSet, api_home

router = SimpleRouter()
router.register("home-posts", HomePostViewSet, basename="home-post")

urlpatterns = [
    path("", api_home, name="api-home"),
    path("auth/csrf/", CsrfTokenView.as_view(), name="auth-csrf"),
    path("auth/login/", AdminLoginView.as_view(), name="admin-login"),
    path("auth/logout/", AdminLogoutView.as_view(), name="admin-logout"),
    path("auth/me/", CurrentUserView.as_view(), name="current-user"),
    path("", include(router.urls)),
]
