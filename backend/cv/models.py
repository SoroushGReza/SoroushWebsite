from django.core.validators import FileExtensionValidator
from django.db import models
from config.storage_backends import get_raw_media_storage


class CVDocument(models.Model):
    title = models.CharField(max_length=180)

    description = models.TextField(
        blank=True,
        help_text="Optional short preview text shown on the CV page.",
    )

    file = models.FileField(
        upload_to="cv_documents/",
        storage=get_raw_media_storage,
        validators=[FileExtensionValidator(allowed_extensions=["pdf"])],
    )

    display_order = models.PositiveIntegerField(
        default=100,
        help_text="Lower numbers appear first. Example: 1 is shown before 2.",
    )

    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def __str__(self):
        return self.title
