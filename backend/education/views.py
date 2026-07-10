from rest_framework import permissions, viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .models import EducationItem
from .serializers import EducationItemSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user and request.user.is_staff


class EducationItemViewSet(viewsets.ModelViewSet):
    serializer_class = EducationItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = EducationItem.objects.all()

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)

        return queryset.order_by("display_order", "-start_date", "title")
