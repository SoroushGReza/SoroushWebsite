from django.urls import include, path
from rest_framework.routers import SimpleRouter

from .auth_views import (
    AdminLoginView,
    AdminLogoutView,
    CsrfTokenView,
    CurrentUserView,
)
from .views import (
    HomePostViewSet,
    PortfolioProjectImageViewSet,
    PortfolioProjectViewSet,
    ProjectContributorViewSet,
    TechStackViewSet,
    api_home,
)

router = SimpleRouter()
router.register("home-posts", HomePostViewSet, basename="home-post")
router.register("tech-stack", TechStackViewSet, basename="tech-stack")
router.register(
    "portfolio-projects",
    PortfolioProjectViewSet,
    basename="portfolio-project",
)
router.register(
    "portfolio-project-images",
    PortfolioProjectImageViewSet,
    basename="portfolio-project-image",
)
router.register(
    "project-contributors",
    ProjectContributorViewSet,
    basename="project-contributor",
)

urlpatterns = [
    path("", api_home, name="api-home"),
    path("auth/csrf/", CsrfTokenView.as_view(), name="auth-csrf"),
    path("auth/login/", AdminLoginView.as_view(), name="auth-login"),
    path("auth/logout/", AdminLogoutView.as_view(), name="auth-logout"),
    path("auth/me/", CurrentUserView.as_view(), name="auth-me"),
    path("", include(router.urls)),
]
