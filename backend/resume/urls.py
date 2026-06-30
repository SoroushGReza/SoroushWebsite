from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AwardViewSet,
    ResumeIntroViewSet,
    SkillGroupViewSet,
    SkillMeterViewSet,
    SkillViewSet,
    WorkExperienceBulletViewSet,
    WorkExperienceViewSet,
)

router = DefaultRouter()
router.register("resume-intro", ResumeIntroViewSet, basename="resume-intro")
router.register("resume-skill-groups", SkillGroupViewSet, basename="resume-skill-group")
router.register("resume-skills", SkillViewSet, basename="resume-skill")
router.register("resume-skill-meters", SkillMeterViewSet, basename="resume-skill-meter")
router.register(
    "resume-work-experiences",
    WorkExperienceViewSet,
    basename="resume-work-experience",
)
router.register(
    "resume-work-experience-bullets",
    WorkExperienceBulletViewSet,
    basename="resume-work-experience-bullet",
)
router.register("resume-awards", AwardViewSet, basename="resume-award")

urlpatterns = [
    path("", include(router.urls)),
]
