from django.conf import settings
from django.core.mail import EmailMessage
from rest_framework import permissions, viewsets

from .models import ContactMessage, ContactProfile
from .serializers import ContactMessageSerializer, ContactProfileSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user and request.user.is_staff


class ContactMessagePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method == "POST":
            return True

        return request.user and request.user.is_staff


def get_contact_recipient_email():
    profile = (
        ContactProfile.objects.filter(is_published=True)
        .exclude(email="")
        .order_by("-updated_at")
        .first()
    )

    if profile and profile.email:
        return profile.email

    return getattr(settings, "CONTACT_FORM_RECEIVER_EMAIL", "")


def send_contact_email(contact_message):
    recipient_email = get_contact_recipient_email()

    if not recipient_email:
        raise ValueError("No recipient email has been configured.")

    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "") or recipient_email

    subject = contact_message.subject.strip()

    if not subject:
        subject = f"New contact request from {contact_message.name}"

    body = f"""
You received a new message from your portfolio contact form.

Name:
{contact_message.name}

Email:
{contact_message.email}

Subject:
{contact_message.subject or "No subject"}

Message:
{contact_message.message}
""".strip()

    email = EmailMessage(
        subject=subject,
        body=body,
        from_email=from_email,
        to=[recipient_email],
        reply_to=[contact_message.email],
    )

    email.send(fail_silently=False)


class ContactProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ContactProfileSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = ContactProfile.objects.all()

        if not self.request.user.is_staff:
            queryset = queryset.filter(is_published=True)

        return queryset.order_by("-updated_at")


class ContactMessageViewSet(viewsets.ModelViewSet):
    serializer_class = ContactMessageSerializer
    permission_classes = [ContactMessagePermission]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ContactMessage.objects.all()

        return ContactMessage.objects.none()

    def perform_create(self, serializer):
        contact_message = serializer.save()

        try:
            send_contact_email(contact_message)
            contact_message.email_sent = True
            contact_message.error_message = ""
        except Exception as error:
            contact_message.email_sent = False
            contact_message.error_message = str(error)

        contact_message.save(update_fields=["email_sent", "error_message"])
