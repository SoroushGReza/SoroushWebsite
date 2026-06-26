from django.contrib import admin

from .models import CVDocument


@admin.register(CVDocument)
class CVDocumentAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "display_order",
        "is_published",
        "created_at",
        "updated_at",
    )
    list_editable = (
        "display_order",
        "is_published",
    )
    list_filter = (
        "is_published",
        "created_at",
    )
    search_fields = (
        "title",
        "description",
    )
    readonly_fields = (
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "CV information",
            {
                "fields": (
                    "title",
                    "description",
                    "file",
                    "display_order",
                    "is_published",
                )
            },
        ),
        (
            "Timestamps",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )
