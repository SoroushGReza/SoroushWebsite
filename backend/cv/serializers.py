from rest_framework import serializers

from .models import CVDocument


class CVDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    file_name = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()

    class Meta:
        model = CVDocument
        fields = [
            "id",
            "title",
            "description",
            "file",
            "file_url",
            "file_name",
            "file_size",
            "display_order",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "file_url",
            "file_name",
            "file_size",
            "created_at",
            "updated_at",
        ]

    def get_file_url(self, obj):
        if not obj.file:
            return None

        request = self.context.get("request")

        if request:
            return request.build_absolute_uri(obj.file.url)

        return obj.file.url

    def get_file_name(self, obj):
        if not obj.file:
            return ""

        return obj.file.name.split("/")[-1]

    def get_file_size(self, obj):
        if not obj.file:
            return 0

        return obj.file.size
