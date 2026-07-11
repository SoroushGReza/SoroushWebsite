from rest_framework import permissions, viewsets

from .models import ContactMessage, ContactProfile
from .serializers import ContactMessageSerializer, ContactProfileSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return bool(request.user and request.user.is_staff)


class ContactMessagePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            return True

        return bool(request.user and request.user.is_staff)


class ContactProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ContactProfileSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = ContactProfile.objects.all()

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)

        return queryset.order_by("-updated_at")


class ContactMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ContactMessageSerializer
    permission_classes = [ContactMessagePermission]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ContactMessage.objects.all()

        return ContactMessage.objects.none()
