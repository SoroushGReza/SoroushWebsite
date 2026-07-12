"""
Django settings for config project.

The same settings file is used for both development and production.
The environment is selected using DJANGO_ENV.
"""

import os
from pathlib import Path

import dj_database_url
from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

# ---------------------------------------------------------------------
# Base configuration
# ---------------------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

# Loads backend/.env during local development.
load_dotenv(BASE_DIR / ".env")


def get_env_list(name: str, default: str = "") -> list[str]:
    value = os.getenv(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]


DJANGO_ENV = os.getenv("DJANGO_ENV", "development").lower()

IS_PRODUCTION = DJANGO_ENV == "production"


# ---------------------------------------------------------------------
# Security
# ---------------------------------------------------------------------

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY")

if not SECRET_KEY:
    raise ImproperlyConfigured(
        "DJANGO_SECRET_KEY is missing from the environment variables."
    )


DEBUG = not IS_PRODUCTION


ALLOWED_HOSTS = get_env_list(
    "DJANGO_ALLOWED_HOSTS",
    "localhost,127.0.0.1",
)

# Render
render_hostname = os.getenv("RENDER_EXTERNAL_HOSTNAME")

if render_hostname and render_hostname not in ALLOWED_HOSTS:
    ALLOWED_HOSTS.append(render_hostname)


CORS_ALLOWED_ORIGINS = get_env_list(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)

CORS_ALLOW_CREDENTIALS = True


CSRF_TRUSTED_ORIGINS = get_env_list(
    "CSRF_TRUSTED_ORIGINS",
    "http://localhost:5173,http://127.0.0.1:5173",
)


# Production security settings
if IS_PRODUCTION:
    SECURE_PROXY_SSL_HEADER = (
        "HTTP_X_FORWARDED_PROTO",
        "https",
    )

    SECURE_SSL_REDIRECT = True

    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

    # Required because React and Django will initially be hosted
    # on different domains: Vercel and Render.
    SESSION_COOKIE_SAMESITE = "None"
    CSRF_COOKIE_SAMESITE = "None"


# ---------------------------------------------------------------------
# Django REST Framework
# ---------------------------------------------------------------------

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.AllowAny",
    ],
}


# ---------------------------------------------------------------------
# Applications
# ---------------------------------------------------------------------

INSTALLED_APPS = [
    "corsheaders",
    "rest_framework",
    # Cloudinary
    "cloudinary_storage",
    "cloudinary",
    # Project applications
    "portfolio",
    "cv",
    "home",
    "resume",
    "education",
    "contact",
    # Django applications
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]


# ---------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # Serves Django Admin static files in production.
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ---------------------------------------------------------------------
# URL and template configuration
# ---------------------------------------------------------------------

ROOT_URLCONF = "config.urls"


TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


WSGI_APPLICATION = "config.wsgi.application"


# ---------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------

if IS_PRODUCTION:
    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise ImproperlyConfigured("DATABASE_URL is missing in production.")

    DATABASES = {
        "default": dj_database_url.parse(
            database_url,
            conn_max_age=600,
            conn_health_checks=True,
            ssl_require=True,
        )
    }

else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }


# ---------------------------------------------------------------------
# Password validation
# ---------------------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": (
            "django.contrib.auth.password_validation."
            "UserAttributeSimilarityValidator"
        ),
    },
    {
        "NAME": ("django.contrib.auth.password_validation." "MinimumLengthValidator"),
    },
    {
        "NAME": ("django.contrib.auth.password_validation." "CommonPasswordValidator"),
    },
    {
        "NAME": ("django.contrib.auth.password_validation." "NumericPasswordValidator"),
    },
]


# ---------------------------------------------------------------------
# Internationalization
# ---------------------------------------------------------------------

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# ---------------------------------------------------------------------
# Static and uploaded media files
# ---------------------------------------------------------------------

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"


if IS_PRODUCTION:
    cloudinary_url = os.getenv("CLOUDINARY_URL")

    if not cloudinary_url:
        raise ImproperlyConfigured("CLOUDINARY_URL is missing in production.")

    STORAGES = {
        # Uploaded images and PDF files go to Cloudinary.
        "default": {
            "BACKEND": ("cloudinary_storage.storage." "MediaCloudinaryStorage"),
        },
        # Django Admin CSS and JavaScript are served by WhiteNoise.
        "staticfiles": {
            "BACKEND": ("whitenoise.storage." "CompressedManifestStaticFilesStorage"),
        },
    }

else:
    STORAGES = {
        # Uploaded files are stored in backend/media locally.
        "default": {
            "BACKEND": ("django.core.files.storage." "FileSystemStorage"),
        },
        "staticfiles": {
            "BACKEND": ("django.contrib.staticfiles.storage." "StaticFilesStorage"),
        },
    }


DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
