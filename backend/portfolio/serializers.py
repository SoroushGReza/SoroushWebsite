from rest_framework import serializers

from .models import (
    HomePost,
    PortfolioProject,
    PortfolioProjectImage,
    ProjectContributor,
    TechStack,
)


class HomePostSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HomePost
        fields = [
            "id",
            "title",
            "summary",
            "image",
            "image_url",
            "link_url",
            "link_text",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "image_url",
            "created_at",
            "updated_at",
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url


class TechStackSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechStack
        fields = [
            "id",
            "name",
            "slug",
            "order",
            "is_active",
        ]


class PortfolioProjectImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioProjectImage
        fields = [
            "id",
            "project",
            "image",
            "image_url",
            "alt_text",
            "order",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "image_url",
            "created_at",
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url


class ProjectContributorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectContributor
        fields = [
            "id",
            "project",
            "name",
            "github_url",
            "role",
            "order",
        ]


class PortfolioProjectSerializer(serializers.ModelSerializer):
    images = PortfolioProjectImageSerializer(many=True, read_only=True)
    contributors = ProjectContributorSerializer(many=True, read_only=True)
    tech_stack = TechStackSerializer(many=True, read_only=True)
    project_type_label = serializers.CharField(
        source="get_project_type_display",
        read_only=True,
    )
    tech_stack_ids = serializers.PrimaryKeyRelatedField(
        queryset=TechStack.objects.all(),
        source="tech_stack",
        many=True,
        write_only=True,
        required=False,
    )

    class Meta:
        model = PortfolioProject
        fields = [
            "id",
            "name",
            "project_type",
            "project_type_label",
            "slug",
            "description",
            "images",
            "live_website_url",
            "github_url",
            "tech_stack",
            "tech_stack_ids",
            "custom_tech_stack",
            "contributors",
            "deployment",
            "databases",
            "is_featured",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "slug",
            "images",
            "contributors",
            "tech_stack",
            "created_at",
            "updated_at",
        ]
