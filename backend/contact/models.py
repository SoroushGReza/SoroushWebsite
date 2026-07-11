from django.core.exceptions import ValidationError
from django.db import models


class ContactProfile(models.Model):
    heading = models.CharField(
        max_length=180,
        default="Do you want to build something?",
    )
    subheading = models.CharField(
        max_length=220,
        blank=True,
        default="I can help you with that.",
    )
    intro_text = models.TextField(blank=True)

    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=60, blank=True)
    whatsapp_number = models.CharField(
        max_length=60,
        blank=True,
        help_text="Use international format, for example +46701234567.",
    )

    address = models.CharField(max_length=220, blank=True)
    city = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=120, blank=True)

    linkedin_url = models.URLField(blank=True)
    instagram_url = models.URLField(blank=True)
    tiktok_url = models.URLField(blank=True)

    telegram = models.CharField(
        max_length=180,
        blank=True,
        help_text="Telegram username, @username, phone number or full URL.",
    )

    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Contact profile"
        verbose_name_plural = "Contact profile"

    def clean(self):
        if not self.pk and ContactProfile.objects.exists():
            raise ValidationError("Only one Contact profile can exist.")

    def __str__(self):
        return self.heading or "Contact profile"


class ContactMessage(models.Model):
    name = models.CharField(max_length=140)
    email = models.EmailField()
    subject = models.CharField(max_length=180, blank=True)
    message = models.TextField()

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} - {self.email}"
