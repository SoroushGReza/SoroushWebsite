from django.contrib import admin

from .models import ContactMessage, ContactProfile


@admin.register(ContactProfile)
class ContactProfileAdmin(admin.ModelAdmin):
    list_display = (
        "heading",
        "email",
        "phone_number",
        "city",
        "country",
        "is_published",
        "updated_at",
    )
    list_editable = ("is_published",)
    readonly_fields = ("created_at", "updated_at")


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "email",
        "subject",
        "email_sent",
        "is_read",
        "created_at",
    )
    list_filter = ("email_sent", "is_read", "created_at")
    list_editable = ("is_read",)
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("created_at", "email_sent", "error_message")
    ordering = ("-created_at",)
