from rest_framework import serializers

from .models import HomeHero


class HomeHeroSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HomeHero
        fields = [
            "id",
            "badge_text",
            "badge_color",
            "hero_title",
            "hero_text",
            "image",
            "image_url",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at", "image_url"]

    def get_image_url(self, obj):
        request = self.context.get("request")

        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)

        if obj.image:
            return obj.image.url

        return ""
