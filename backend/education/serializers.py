from rest_framework import serializers

from .models import EducationItem


def build_file_url(request, file_field):
    if not file_field:
        return ""

    if request:
        return request.build_absolute_uri(file_field.url)

    return file_field.url


class EducationItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    education_type_label = serializers.CharField(
        source="get_education_type_display",
        read_only=True,
    )

    class Meta:
        model = EducationItem
        fields = [
            "id",
            "title",
            "institution",
            "education_type",
            "education_type_label",
            "location",
            "description",
            "image",
            "image_url",
            "link_url",
            "link_text",
            "icon_class",
            "color_hex",
            "start_date",
            "end_date",
            "is_current",
            "display_order",
            "is_featured",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "image_url",
            "education_type_label",
            "created_at",
            "updated_at",
        ]

    def get_image_url(self, obj):
        request = self.context.get("request")
        return build_file_url(request, obj.image)
