from rest_framework import serializers

from .models import HomePost


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
        read_only_fields = ["id", "image_url", "created_at", "updated_at"]

    def get_image_url(self, obj):
        if not obj.image:
            return ""

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.image.url)

        return obj.image.url
