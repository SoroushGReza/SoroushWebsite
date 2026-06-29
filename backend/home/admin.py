from django.contrib import admin

from .models import HomeHero


@admin.register(HomeHero)
class HomeHeroAdmin(admin.ModelAdmin):
    list_display = ("hero_title", "badge_text", "badge_color", "updated_at")
    readonly_fields = ("created_at", "updated_at")
