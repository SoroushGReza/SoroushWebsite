from django.contrib import admin

from .models import (
    Award,
    ResumeIntro,
    Skill,
    SkillGroup,
    SkillMeter,
    WorkExperience,
    WorkExperienceBullet,
)


class SkillInline(admin.TabularInline):
    model = Skill
    extra = 1
    fields = (
        "name",
        "description",
        "icon_class",
        "icon_image",
        "color_hex",
        "display_order",
        "is_published",
    )


@admin.register(SkillGroup)
class SkillGroupAdmin(admin.ModelAdmin):
    list_display = ("name", "display_order", "is_published", "updated_at")
    list_editable = ("display_order", "is_published")
    search_fields = ("name", "description")
    ordering = ("display_order", "name")
    inlines = [SkillInline]


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "group", "display_order", "is_published", "updated_at")
    list_filter = ("group", "is_published")
    list_editable = ("display_order", "is_published")
    search_fields = ("name", "description", "icon_class")
    ordering = ("group__display_order", "display_order", "name")


@admin.register(SkillMeter)
class SkillMeterAdmin(admin.ModelAdmin):
    list_display = ("name", "percentage", "color_hex", "display_order", "is_published")
    list_editable = ("percentage", "color_hex", "display_order", "is_published")
    search_fields = ("name", "icon_class")
    ordering = ("display_order", "name")


class WorkExperienceBulletInline(admin.TabularInline):
    model = WorkExperienceBullet
    extra = 1
    fields = ("text", "display_order")


@admin.register(WorkExperience)
class WorkExperienceAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "organization",
        "experience_type",
        "start_date",
        "end_date",
        "is_current",
        "display_order",
        "is_published",
    )
    list_filter = ("experience_type", "is_current", "is_published")
    list_editable = ("display_order", "is_published")
    search_fields = ("title", "organization", "location", "summary")
    ordering = ("display_order", "-start_date", "title")
    inlines = [WorkExperienceBulletInline]


@admin.register(WorkExperienceBullet)
class WorkExperienceBulletAdmin(admin.ModelAdmin):
    list_display = ("text", "experience", "display_order")
    list_filter = ("experience",)
    list_editable = ("display_order",)
    search_fields = ("text",)


@admin.register(Award)
class AwardAdmin(admin.ModelAdmin):
    list_display = ("title", "issuer", "award_date", "display_order", "is_published")
    list_filter = ("is_published", "award_date")
    list_editable = ("display_order", "is_published")
    search_fields = ("title", "issuer", "description")
    ordering = ("display_order", "-award_date", "title")
    readonly_fields = ("created_at", "updated_at")


@admin.register(ResumeIntro)
class ResumeIntroAdmin(admin.ModelAdmin):
    list_display = ("title", "subtitle", "is_published", "updated_at")
    list_editable = ("is_published",)
    readonly_fields = ("created_at", "updated_at")
