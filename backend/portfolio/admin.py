from django.contrib import admin

from .models import HomePost


@admin.register(HomePost)
class HomePostAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "created_at", "updated_at")
    list_filter = ("is_published", "created_at")
    search_fields = ("title", "summary", "link_text", "link_url")
    readonly_fields = ("created_at", "updated_at")
