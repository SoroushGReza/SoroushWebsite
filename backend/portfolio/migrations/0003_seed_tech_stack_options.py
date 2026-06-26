from django.db import migrations
from django.utils.text import slugify

TECH_STACK_OPTIONS = [
    "Python",
    "Django",
    "Django REST Framework",
    "React",
    "CSS",
    "JavaScript",
    "SQL",
    "R",
    "HTML",
    "Agile Methodologies",
    "Machine Learning",
    "Deep Learning",
    "Canva",
    "Responsive Web Design",
    "Tailwind CSS",
    "API Development",
    "React Bootstrap",
    "Bootstrap",
    "JSON Web Token (JWT)",
    "Stripe Integration",
    "DaisyUI",
    "Business Intelligence",
    "Power BI",
    "Power Pivot",
    "Excel",
    "Statistical Data Analysis",
]


def get_unique_slug(TechStack, name):
    base_slug = slugify(name)
    slug = base_slug
    counter = 1

    while TechStack.objects.filter(slug=slug).exists():
        counter += 1
        slug = f"{base_slug}-{counter}"

    return slug


def seed_tech_stack_options(apps, schema_editor):
    TechStack = apps.get_model("portfolio", "TechStack")

    for index, name in enumerate(TECH_STACK_OPTIONS, start=1):
        existing_tech_stack = TechStack.objects.filter(name=name).first()

        if existing_tech_stack:
            existing_tech_stack.slug = slugify(name)
            existing_tech_stack.order = index
            existing_tech_stack.is_active = True
            existing_tech_stack.save(
                update_fields=[
                    "slug",
                    "order",
                    "is_active",
                ]
            )
            continue

        TechStack.objects.create(
            name=name,
            slug=get_unique_slug(TechStack, name),
            order=index,
            is_active=True,
        )


def remove_tech_stack_options(apps, schema_editor):
    TechStack = apps.get_model("portfolio", "TechStack")
    TechStack.objects.filter(name__in=TECH_STACK_OPTIONS).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("portfolio", "0002_portfolioproject_techstack_portfolioprojectimage_and_more"),
    ]

    operations = [
        migrations.RunPython(
            seed_tech_stack_options,
            remove_tech_stack_options,
        ),
    ]
