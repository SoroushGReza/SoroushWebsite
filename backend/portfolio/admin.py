from django.contrib import admin

from .models import (
    HomePost,
    PortfolioProject,
    PortfolioProjectImage,
    ProjectContributor,
    TechStack,
)


@admin.register(HomePost)
class HomePostAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "created_at", "updated_at")
    list_filter = ("is_published", "created_at")
    search_fields = ("title", "summary")
    readonly_fields = ("created_at", "updated_at")


@admin.register(TechStack)
class TechStackAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order", "is_active")
    list_filter = ("is_active",)
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}
    ordering = ("order", "name")


class PortfolioProjectImageInline(admin.TabularInline):
    model = PortfolioProjectImage
    extra = 1
    fields = ("image", "alt_text", "order")


class ProjectContributorInline(admin.TabularInline):
    model = ProjectContributor
    extra = 1
    fields = ("name", "github_url", "role", "order")


@admin.register(PortfolioProject)
class PortfolioProjectAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "project_type",
        "display_order",
        "is_featured",
        "is_published",
        "created_at",
        "updated_at",
    )
    list_filter = (
        "project_type",
        "is_featured",
        "is_published",
        "tech_stack",
        "created_at",
    )
    search_fields = (
        "name",
        "description",
        "custom_tech_stack",
        "deployment",
        "databases",
    )
    prepopulated_fields = {"slug": ("name",)}
    list_editable = ("display_order",)
    filter_horizontal = ("tech_stack",)
    readonly_fields = ("created_at", "updated_at")
    inlines = (PortfolioProjectImageInline, ProjectContributorInline)

    fieldsets = (
        (
            "Project information",
            {
                "fields": (
                    "name",
                    "project_type",
                    "display_order",
                    "slug",
                    "description",
                    "is_featured",
                    "is_published",
                )
            },
        ),
        (
            "Links",
            {
                "fields": (
                    "live_website_url",
                    "github_url",
                )
            },
        ),
        (
            "Tech stack",
            {
                "fields": (
                    "tech_stack",
                    "custom_tech_stack",
                    "deployment",
                    "databases",
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
