from django.core.exceptions import ValidationError
from django.db import models


class HomeHero(models.Model):
    BADGE_COLOR_CHOICES = [
        ("primary", "Blue / Primary"),
        ("secondary", "Gray / Secondary"),
        ("success", "Green / Success"),
        ("danger", "Red / Danger"),
        ("warning", "Yellow / Warning"),
        ("info", "Cyan / Info"),
        ("light", "Light"),
        ("dark", "Dark"),
    ]

    badge_text = models.CharField(max_length=80, default="Current focus")
    badge_color = models.CharField(
        max_length=20,
        choices=BADGE_COLOR_CHOICES,
        default="info",
    )
    hero_title = models.CharField(max_length=220)
    hero_text = models.TextField()
    image = models.ImageField(upload_to="home/hero/", blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Home hero"
        verbose_name_plural = "Home hero"

    def clean(self):
        if not self.pk and HomeHero.objects.exists():
            raise ValidationError("Only one Home hero section can exist.")

    def __str__(self):
        return self.hero_title
