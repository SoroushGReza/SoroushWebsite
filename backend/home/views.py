from rest_framework import permissions, viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .models import HomeHero
from .serializers import HomeHeroSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user and request.user.is_staff


class HomeHeroViewSet(viewsets.ModelViewSet):
    queryset = HomeHero.objects.all().order_by("-updated_at")
    serializer_class = HomeHeroSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        HomeHero.objects.all().delete()
        serializer.save()
