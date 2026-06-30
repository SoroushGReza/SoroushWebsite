from django.db.models import Prefetch
from rest_framework import permissions, viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser

from .models import (
    Award,
    ResumeIntro,
    Skill,
    SkillGroup,
    SkillMeter,
    WorkExperience,
    WorkExperienceBullet,
)
from .serializers import (
    AwardSerializer,
    ResumeIntroSerializer,
    SkillGroupSerializer,
    SkillMeterSerializer,
    SkillSerializer,
    WorkExperienceBulletSerializer,
    WorkExperienceSerializer,
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user and request.user.is_staff


class ResumeIntroViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeIntroSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = ResumeIntro.objects.all()

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)

        return queryset.order_by("-updated_at")

    def perform_create(self, serializer):
        ResumeIntro.objects.all().delete()
        serializer.save()


class SkillGroupViewSet(viewsets.ModelViewSet):
    serializer_class = SkillGroupSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        skills_queryset = Skill.objects.all()

        if not self.request.user.is_staff:
            skills_queryset = skills_queryset.filter(is_published=True)

        queryset = SkillGroup.objects.prefetch_related(
            Prefetch("skills", queryset=skills_queryset),
        )

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)

        return queryset.order_by("display_order", "name")


class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Skill.objects.select_related("group")

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True, group__is_published=True)

        return queryset.order_by("group__display_order", "display_order", "name")


class SkillMeterViewSet(viewsets.ModelViewSet):
    serializer_class = SkillMeterSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = SkillMeter.objects.all()

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)

        return queryset.order_by("display_order", "name")


class WorkExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = WorkExperienceSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = WorkExperience.objects.prefetch_related("bullets")

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)

        return queryset.order_by("display_order", "-start_date", "title")


class WorkExperienceBulletViewSet(viewsets.ModelViewSet):
    serializer_class = WorkExperienceBulletSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = WorkExperienceBullet.objects.select_related("experience")

        if not self.request.user.is_staff:
            queryset = queryset.filter(experience__is_published=True)

        return queryset.order_by("experience__display_order", "display_order", "id")


class AwardViewSet(viewsets.ModelViewSet):
    serializer_class = AwardSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Award.objects.all()

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)

        return queryset.order_by("display_order", "-award_date", "title")
