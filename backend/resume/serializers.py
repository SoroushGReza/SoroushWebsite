from rest_framework import serializers

from .models import (
    Award,
    ResumeIntro,
    Skill,
    SkillGroup,
    SkillMeter,
    WorkExperience,
    WorkExperienceBullet,
)


def build_file_url(request, file_field):
    if not file_field:
        return ""

    if request:
        return request.build_absolute_uri(file_field.url)

    return file_field.url


class ResumeIntroSerializer(serializers.ModelSerializer):
    class Meta:
        model = ResumeIntro
        fields = [
            "id",
            "title",
            "subtitle",
            "summary",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class SkillSerializer(serializers.ModelSerializer):
    icon_image_url = serializers.SerializerMethodField()
    group_name = serializers.CharField(source="group.name", read_only=True)

    class Meta:
        model = Skill
        fields = [
            "id",
            "group",
            "group_name",
            "name",
            "description",
            "icon_class",
            "icon_image",
            "icon_image_url",
            "color_hex",
            "display_order",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "icon_image_url", "group_name"]

    def get_icon_image_url(self, obj):
        request = self.context.get("request")
        return build_file_url(request, obj.icon_image)


class SkillGroupSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)

    class Meta:
        model = SkillGroup
        fields = [
            "id",
            "name",
            "description",
            "color_hex",
            "display_order",
            "is_published",
            "skills",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "skills"]


class SkillMeterSerializer(serializers.ModelSerializer):
    icon_image_url = serializers.SerializerMethodField()

    class Meta:
        model = SkillMeter
        fields = [
            "id",
            "name",
            "percentage",
            "color_hex",
            "icon_class",
            "icon_image",
            "icon_image_url",
            "display_order",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "icon_image_url"]

    def get_icon_image_url(self, obj):
        request = self.context.get("request")
        return build_file_url(request, obj.icon_image)


class WorkExperienceBulletSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExperienceBullet
        fields = [
            "id",
            "experience",
            "text",
            "display_order",
        ]


class WorkExperienceSerializer(serializers.ModelSerializer):
    bullets = WorkExperienceBulletSerializer(many=True, read_only=True)
    experience_type_label = serializers.CharField(
        source="get_experience_type_display",
        read_only=True,
    )

    class Meta:
        model = WorkExperience
        fields = [
            "id",
            "title",
            "organization",
            "location",
            "experience_type",
            "experience_type_label",
            "start_date",
            "end_date",
            "is_current",
            "summary",
            "bullets",
            "display_order",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "bullets",
            "experience_type_label",
        ]


class AwardSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()
    file_type = serializers.SerializerMethodField()

    class Meta:
        model = Award
        fields = [
            "id",
            "title",
            "issuer",
            "description",
            "award_date",
            "file",
            "file_url",
            "file_name",
            "file_type",
            "display_order",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
            "file_url",
            "file_name",
            "file_type",
        ]

    def get_file_url(self, obj):
        request = self.context.get("request")
        return build_file_url(request, obj.file)

    def get_file_name(self, obj):
        if obj.file:
            return obj.file.name.split("/")[-1]

        return ""

    def get_file_type(self, obj):
        if not obj.file:
            return ""

        file_name = obj.file.name.lower()

        if file_name.endswith(".pdf"):
            return "pdf"

        return "image"
