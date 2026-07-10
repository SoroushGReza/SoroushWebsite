from django.core.validators import RegexValidator
from django.db import models

hex_color_validator = RegexValidator(
    regex=r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    message="Enter a valid hex color, for example #f97316.",
)


class EducationItem(models.Model):
    EDUCATION_TYPE_CHOICES = [
        ("formal", "Formal education"),
        ("higher_education", "Higher education"),
        ("vocational", "Vocational education"),
        ("bootcamp", "Bootcamp"),
        ("course", "Course"),
        ("certification", "Certification"),
        ("self_study", "Self study"),
        ("school", "School"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=180)
    institution = models.CharField(max_length=180, blank=True)
    education_type = models.CharField(
        max_length=40,
        choices=EDUCATION_TYPE_CHOICES,
        default="formal",
    )
    location = models.CharField(max_length=160, blank=True)

    description = models.TextField(blank=True)

    image = models.ImageField(
        upload_to="education/images/",
        blank=True,
        null=True,
    )

    link_url = models.URLField(blank=True)
    link_text = models.CharField(
        max_length=80,
        blank=True,
        default="View more",
    )

    icon_class = models.CharField(
        max_length=120,
        blank=True,
        help_text="Example: fa-solid fa-graduation-cap, fa-solid fa-brain, fa-solid fa-certificate",
    )

    color_hex = models.CharField(
        max_length=7,
        default="#f97316",
        validators=[hex_color_validator],
    )

    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)

    display_order = models.PositiveIntegerField(default=100)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-start_date", "title"]

    def __str__(self):
        if self.institution:
            return f"{self.title} - {self.institution}"

        return self.title
