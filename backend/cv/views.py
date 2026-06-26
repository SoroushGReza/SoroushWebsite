from rest_framework import parsers, viewsets

from .models import CVDocument
from .permissions import IsAdminOrReadOnly
from .serializers import CVDocumentSerializer


class CVDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = CVDocumentSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [
        parsers.MultiPartParser,
        parsers.FormParser,
        parsers.JSONParser,
    ]

    def get_queryset(self):
        queryset = CVDocument.objects.order_by("display_order", "-created_at")

        if self.request.user.is_staff:
            return queryset

        return queryset.filter(is_published=True)
