from rest_framework import serializers

from .models import ContactMessage, ContactProfile


def clean_phone_number(value):
    return value.replace(" ", "").replace("-", "").replace("(", "").replace(")", "")


def build_telegram_url(value):
    if not value:
        return ""

    telegram_value = value.strip()

    if telegram_value.startswith("http://") or telegram_value.startswith("https://"):
        return telegram_value

    if telegram_value.startswith("@"):
        telegram_value = telegram_value[1:]

    return f"https://t.me/{telegram_value}"


class ContactProfileSerializer(serializers.ModelSerializer):
    full_location = serializers.SerializerMethodField()
    contact_items = serializers.SerializerMethodField()

    class Meta:
        model = ContactProfile
        fields = [
            "id",
            "heading",
            "subheading",
            "intro_text",
            "email",
            "phone_number",
            "whatsapp_number",
            "address",
            "city",
            "country",
            "linkedin_url",
            "instagram_url",
            "tiktok_url",
            "telegram",
            "full_location",
            "contact_items",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "full_location",
            "contact_items",
            "created_at",
            "updated_at",
        ]

    def get_full_location(self, obj):
        location_parts = [obj.address, obj.city, obj.country]
        return ", ".join(part for part in location_parts if part)

    def get_contact_items(self, obj):
        items = []

        if obj.email:
            items.append(
                {
                    "type": "email",
                    "label": "Email",
                    "value": obj.email,
                    "href": f"mailto:{obj.email}",
                    "icon_class": "fa-solid fa-envelope",
                }
            )

        if obj.phone_number:
            phone_href = clean_phone_number(obj.phone_number)

            items.append(
                {
                    "type": "phone",
                    "label": "Phone",
                    "value": obj.phone_number,
                    "href": f"tel:{phone_href}",
                    "icon_class": "fa-solid fa-phone",
                }
            )

        if obj.whatsapp_number:
            whatsapp_clean = clean_phone_number(obj.whatsapp_number).replace("+", "")

            items.append(
                {
                    "type": "whatsapp",
                    "label": "WhatsApp",
                    "value": obj.whatsapp_number,
                    "href": f"https://wa.me/{whatsapp_clean}",
                    "icon_class": "fa-brands fa-whatsapp",
                }
            )

        full_location = self.get_full_location(obj)

        if full_location:
            items.append(
                {
                    "type": "location",
                    "label": "Location",
                    "value": full_location,
                    "href": f"https://www.google.com/maps/search/?api=1&query={full_location}",
                    "icon_class": "fa-solid fa-location-dot",
                }
            )

        if obj.linkedin_url:
            items.append(
                {
                    "type": "linkedin",
                    "label": "LinkedIn",
                    "value": "LinkedIn profile",
                    "href": obj.linkedin_url,
                    "icon_class": "fa-brands fa-linkedin",
                }
            )

        if obj.instagram_url:
            items.append(
                {
                    "type": "instagram",
                    "label": "Instagram",
                    "value": "Instagram profile",
                    "href": obj.instagram_url,
                    "icon_class": "fa-brands fa-instagram",
                }
            )

        if obj.tiktok_url:
            items.append(
                {
                    "type": "tiktok",
                    "label": "TikTok",
                    "value": "TikTok profile",
                    "href": obj.tiktok_url,
                    "icon_class": "fa-brands fa-tiktok",
                }
            )

        if obj.telegram:
            items.append(
                {
                    "type": "telegram",
                    "label": "Telegram",
                    "value": obj.telegram,
                    "href": build_telegram_url(obj.telegram),
                    "icon_class": "fa-brands fa-telegram",
                }
            )

        return items


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            "id",
            "name",
            "email",
            "subject",
            "message",
            "email_sent",
            "error_message",
            "is_read",
            "created_at",
        ]
        read_only_fields = [
            "email_sent",
            "error_message",
            "is_read",
            "created_at",
        ]
