from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator, RegexValidator
from django.db import models
from config.storage_backends import get_raw_media_storage

hex_color_validator = RegexValidator(
    regex=r"^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$",
    message="Enter a valid hex color, for example #0dcaf0.",
)


def validate_award_file(file):
    allowed_extensions = [".pdf", ".jpg", ".jpeg", ".png", ".webp"]
    file_name = file.name.lower()

    if not any(file_name.endswith(extension) for extension in allowed_extensions):
        raise ValidationError("Only PDF and image files are allowed.")


class ResumeIntro(models.Model):
    title = models.CharField(max_length=160, blank=True, default="")
    subtitle = models.CharField(max_length=220, blank=True)
    summary = models.TextField(blank=True)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Resume intro"
        verbose_name_plural = "Resume intro"

    def clean(self):
        if not self.pk and ResumeIntro.objects.exists():
            raise ValidationError("Only one Resume intro can exist.")

    def __str__(self):
        return self.title


class SkillGroup(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    icon_class = models.CharField(
        max_length=120,
        blank=True,
        help_text="Example: fa-solid fa-code, fa-solid fa-database, fa-solid fa-brain",
    )
    color_hex = models.CharField(
        max_length=7,
        default="#0dcaf0",
        validators=[hex_color_validator],
    )
    display_order = models.PositiveIntegerField(default=100)
    show_in_profile = models.BooleanField(
        default=False,
        help_text="Show this group as a large card in the Technical profile / My Skills section.",
    )
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return self.name


class Skill(models.Model):
    group = models.ForeignKey(
        SkillGroup,
        related_name="skills",
        on_delete=models.CASCADE,
    )
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    icon_class = models.CharField(
        max_length=120,
        blank=True,
        help_text="Example: fa-brands fa-react or fa-solid fa-brain",
    )
    icon_image = models.ImageField(
        upload_to="resume/skill-icons/",
        blank=True,
        null=True,
    )
    color_hex = models.CharField(
        max_length=7,
        default="#0dcaf0",
        validators=[hex_color_validator],
    )
    display_order = models.PositiveIntegerField(default=100)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["group__display_order", "display_order", "name"]

    def __str__(self):
        return self.name


class SkillMeter(models.Model):
    name = models.CharField(max_length=120)
    percentage = models.PositiveIntegerField(
        default=50,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    color_hex = models.CharField(
        max_length=7,
        default="#0dcaf0",
        validators=[hex_color_validator],
    )
    icon_class = models.CharField(
        max_length=120,
        blank=True,
        help_text="Example: fa-brands fa-html5 or fa-brands fa-python",
    )
    icon_image = models.ImageField(
        upload_to="resume/skill-meter-icons/",
        blank=True,
        null=True,
    )
    display_order = models.PositiveIntegerField(default=100)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "name"]

    def __str__(self):
        return f"{self.name} - {self.percentage}%"


class WorkExperience(models.Model):
    EXPERIENCE_TYPE_CHOICES = [
        ("work", "Work"),
        ("education", "Education"),
        ("military", "Military service"),
        ("psychology", "Psychology"),
        ("data_science", "Data Science"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=160)
    organization = models.CharField(max_length=160, blank=True)
    location = models.CharField(max_length=160, blank=True)
    experience_type = models.CharField(
        max_length=30,
        choices=EXPERIENCE_TYPE_CHOICES,
        default="work",
    )
    icon_class = models.CharField(
        max_length=120,
        blank=True,
        help_text="Example: fa-solid fa-briefcase, fa-solid fa-graduation-cap, fa-solid fa-shield-halved",
    )
    color_hex = models.CharField(
        max_length=7,
        default="#a3ff94",
        validators=[hex_color_validator],
    )
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)
    summary = models.TextField(blank=True)
    display_order = models.PositiveIntegerField(default=100)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-start_date", "title"]

    def __str__(self):
        return self.title


class WorkExperienceBullet(models.Model):
    experience = models.ForeignKey(
        WorkExperience,
        related_name="bullets",
        on_delete=models.CASCADE,
    )
    text = models.CharField(max_length=280)
    display_order = models.PositiveIntegerField(default=100)

    class Meta:
        ordering = ["display_order", "id"]

    def __str__(self):
        return self.text


class Award(models.Model):
    title = models.CharField(max_length=160)
    issuer = models.CharField(max_length=160, blank=True)
    description = models.TextField(blank=True)
    award_date = models.DateField(blank=True, null=True)
    file = models.FileField(
        upload_to="resume/awards/",
        storage=get_raw_media_storage,
        validators=[validate_award_file],
        blank=True,
        null=True,
    )
    display_order = models.PositiveIntegerField(default=100)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-award_date", "title"]

    def __str__(self):
        return self.title
