from django.contrib import admin

from .models import EducationItem


@admin.register(EducationItem)
class EducationItemAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "institution",
        "education_type",
        "start_date",
        "end_date",
        "is_current",
        "display_order",
        "is_featured",
        "is_published",
    )
    list_filter = (
        "education_type",
        "is_current",
        "is_featured",
        "is_published",
    )
    list_editable = (
        "display_order",
        "is_featured",
        "is_published",
    )
    search_fields = (
        "title",
        "institution",
        "location",
        "description",
        "icon_class",
    )
    ordering = ("display_order", "-start_date", "title")
    readonly_fields = ("created_at", "updated_at")
