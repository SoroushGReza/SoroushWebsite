from django.db import models


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
