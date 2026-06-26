from rest_framework.routers import SimpleRouter

from .views import CVDocumentViewSet

router = SimpleRouter()
router.register("cv-documents", CVDocumentViewSet, basename="cv-document")

urlpatterns = router.urls
