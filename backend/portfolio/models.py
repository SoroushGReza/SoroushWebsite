from django.db import models
from django.utils.text import slugify


class HomePost(models.Model):
    title = models.CharField(max_length=160)
    summary = models.TextField()
    image = models.ImageField(upload_to="home_posts/", blank=True, null=True)
    link_url = models.URLField(blank=True)
    link_text = models.CharField(max_length=120, blank=True)
    is_published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class TechStack(models.Model):
    name = models.CharField(max_length=80, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "name"]
        verbose_name = "Tech stack"
        verbose_name_plural = "Tech stack"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PortfolioProjectType(models.TextChoices):
    HACKATHON = "hackathon", "Hackathon Project"
    PORTFOLIO = "portfolio", "Portfolio Project"
    FREELANCE = "freelance", "Freelance Project"


class PortfolioProject(models.Model):
    name = models.CharField(max_length=180)
    project_type = models.CharField(
        max_length=20,
        choices=PortfolioProjectType.choices,
        default=PortfolioProjectType.PORTFOLIO,
    )
    display_order = models.PositiveIntegerField(
        default=100,
        help_text="Lower numbers appear first. Example: 1 is shown before 2.",
    )
    slug = models.SlugField(max_length=220, unique=True, blank=True)
    description = models.TextField()

    images_note = models.CharField(
        max_length=255,
        blank=True,
        help_text="Images are uploaded separately below this project.",
    )

    live_website_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)

    tech_stack = models.ManyToManyField(
        TechStack,
        blank=True,
        related_name="portfolio_projects",
    )
    custom_tech_stack = models.TextField(
        blank=True,
        help_text="Write extra tools, languages, frameworks or methods not listed above.",
    )

    deployment = models.CharField(
        max_length=180,
        blank=True,
        help_text="Example: Heroku, Vercel, Netlify, Render, Railway, PythonAnywhere.",
    )
    databases = models.CharField(
        max_length=220,
        blank=True,
        help_text="Example: PostgreSQL, SQLite, MySQL, MongoDB.",
    )

    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1

            while (
                PortfolioProject.objects.filter(slug=slug).exclude(pk=self.pk).exists()
            ):
                counter += 1
                slug = f"{base_slug}-{counter}"

            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PortfolioProjectImage(models.Model):
    project = models.ForeignKey(
        PortfolioProject,
        on_delete=models.CASCADE,
        related_name="images",
    )
    image = models.ImageField(upload_to="portfolio_projects/")
    alt_text = models.CharField(max_length=160, blank=True)
    order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order", "created_at"]

    def __str__(self):
        return f"{self.project.name} image"


class ProjectContributor(models.Model):
    project = models.ForeignKey(
        PortfolioProject,
        on_delete=models.CASCADE,
        related_name="contributors",
    )
    name = models.CharField(max_length=120)
    github_url = models.URLField(blank=True)
    role = models.CharField(
        max_length=120,
        blank=True,
        help_text="Optional. Example: Frontend developer, Backend developer, Designer.",
    )
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name
