import os

from cloudinary_storage.storage import RawMediaCloudinaryStorage
from django.core.files.storage import FileSystemStorage


def get_raw_media_storage():
    """
    Use local file storage during development.

    Use Cloudinary raw-file storage in production for files
    such as PDF documents.
    """
    django_env = os.getenv("DJANGO_ENV", "development").lower()

    if django_env == "production":
        return RawMediaCloudinaryStorage()

    return FileSystemStorage()
