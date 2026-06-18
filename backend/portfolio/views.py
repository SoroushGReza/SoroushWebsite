from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response

from .models import HomePost
from .permissions import IsAdminOrReadOnly
from .serializers import HomePostSerializer


@api_view(["GET"])
def api_home(request):
    return Response(
        {
            "message": "Portfolio API is running",
            "status": "ok",
        }
    )


class HomePostViewSet(viewsets.ModelViewSet):
    serializer_class = HomePostSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = HomePost.objects.all()

        if self.request.user and self.request.user.is_staff:
            return queryset

        return queryset.filter(is_published=True)
