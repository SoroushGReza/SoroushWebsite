from rest_framework import parsers, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    HomePost,
    PortfolioProject,
    PortfolioProjectImage,
    ProjectContributor,
    TechStack,
)
from .permissions import IsAdminOrReadOnly
from .serializers import (
    HomePostSerializer,
    PortfolioProjectImageSerializer,
    PortfolioProjectSerializer,
    ProjectContributorSerializer,
    TechStackSerializer,
)


@api_view(["GET"])
def api_home(request):
    return Response(
        {
            "message": "Portfolio API is running.",
            "status": "ok",
        }
    )


class HomePostViewSet(viewsets.ModelViewSet):
    serializer_class = HomePostSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [
        parsers.MultiPartParser,
        parsers.FormParser,
        parsers.JSONParser,
    ]

    def get_queryset(self):
        queryset = HomePost.objects.all()

        if self.request.user.is_staff:
            return queryset

        return queryset.filter(is_published=True)


class TechStackViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TechStackSerializer

    def get_queryset(self):
        return TechStack.objects.filter(is_active=True)


class PortfolioProjectViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [
        parsers.MultiPartParser,
        parsers.FormParser,
        parsers.JSONParser,
    ]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = PortfolioProject.objects.prefetch_related(
            "images",
            "contributors",
            "tech_stack",
        )

        if self.request.user.is_staff:
            return queryset

        return queryset.filter(is_published=True)


class PortfolioProjectImageViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioProjectImageSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [
        parsers.MultiPartParser,
        parsers.FormParser,
        parsers.JSONParser,
    ]

    def get_queryset(self):
        queryset = PortfolioProjectImage.objects.select_related("project")

        if self.request.user.is_staff:
            return queryset

        return queryset.filter(project__is_published=True)


class ProjectContributorViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectContributorSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = ProjectContributor.objects.select_related("project")

        if self.request.user.is_staff:
            return queryset

        return queryset.filter(project__is_published=True)
