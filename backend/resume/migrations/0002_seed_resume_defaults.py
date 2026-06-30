from django.db import migrations


def seed_resume_defaults(apps, schema_editor):
    ResumeIntro = apps.get_model("resume", "ResumeIntro")
    SkillGroup = apps.get_model("resume", "SkillGroup")
    Skill = apps.get_model("resume", "Skill")
    SkillMeter = apps.get_model("resume", "SkillMeter")
    WorkExperience = apps.get_model("resume", "WorkExperience")
    WorkExperienceBullet = apps.get_model("resume", "WorkExperienceBullet")
    Award = apps.get_model("resume", "Award")

    ResumeIntro.objects.get_or_create(
        title="Resume",
        defaults={
            "subtitle": "Junior Full Stack Developer & Data Science Student",
            "summary": (
                "Junior Full Stack Developer with experience in Python, "
                "JavaScript, CSS, HTML, Django, Django REST Framework, React, "
                "Flask and Bootstrap. Currently expanding my skills in Data "
                "Science, Machine Learning, psychology-related analysis, and "
                "structured problem-solving through studies and practical projects."
            ),
            "is_published": True,
        },
    )

    skill_groups = [
        {
            "name": "Frontend",
            "description": (
                "Responsive and user-friendly web interfaces using React, "
                "HTML, CSS, JavaScript, Bootstrap and related tools."
            ),
            "color_hex": "#0dcaf0",
            "display_order": 1,
            "skills": [
                "React",
                "React Bootstrap",
                "HTML",
                "CSS",
                "JavaScript",
                "Responsive Design",
                "UX Design",
            ],
        },
        {
            "name": "Backend",
            "description": (
                "Backend functionality, APIs and database-connected applications "
                "using Python, Django and Django REST Framework."
            ),
            "color_hex": "#22c55e",
            "display_order": 2,
            "skills": [
                "Python",
                "Django",
                "Django REST Framework",
                "Flask",
                "REST APIs",
                "Authentication",
            ],
        },
        {
            "name": "Data Science",
            "description": (
                "Current studies and projects focused on data analysis, "
                "machine learning, model evaluation and data-driven thinking."
            ),
            "color_hex": "#a855f7",
            "display_order": 3,
            "skills": [
                "Machine Learning",
                "Deep Learning",
                "Data Analysis",
                "Pandas",
                "NumPy",
                "Model Evaluation",
            ],
        },
        {
            "name": "Tools",
            "description": "Development tools used for coding, version control and deployment.",
            "color_hex": "#f97316",
            "display_order": 4,
            "skills": [
                "Git",
                "GitHub",
                "VS Code",
                "Heroku",
                "Render",
            ],
        },
        {
            "name": "Databases",
            "description": "Relational and non-relational database experience.",
            "color_hex": "#3b82f6",
            "display_order": 5,
            "skills": [
                "PostgreSQL",
                "MySQL",
                "SQLite",
                "SQL",
                "NoSQL",
            ],
        },
        {
            "name": "Psychology",
            "description": (
                "People-focused understanding, communication, behavior, "
                "motivation and human-centered problem solving."
            ),
            "color_hex": "#ec4899",
            "display_order": 6,
            "skills": [
                "Human Behavior",
                "Communication",
                "Critical Thinking",
                "Empathy",
                "Problem Solving",
            ],
        },
        {
            "name": "Military Service",
            "description": (
                "Discipline, responsibility, structure, teamwork and resilience "
                "from military service experience."
            ),
            "color_hex": "#84cc16",
            "display_order": 7,
            "skills": [
                "Discipline",
                "Teamwork",
                "Responsibility",
                "Stress Management",
                "Leadership",
            ],
        },
        {
            "name": "Creative Tools",
            "description": "Creative and visual tools used for design, websites and content.",
            "color_hex": "#f43f5e",
            "display_order": 8,
            "skills": [
                "Canva",
                "Photoshop",
                "WordPress",
                "Design Thinking",
                "Art",
            ],
        },
    ]

    for group_data in skill_groups:
        skills = group_data.pop("skills")

        group, _created = SkillGroup.objects.get_or_create(
            name=group_data["name"],
            defaults=group_data,
        )

        for index, skill_name in enumerate(skills, start=1):
            Skill.objects.get_or_create(
                group=group,
                name=skill_name,
                defaults={
                    "color_hex": group.color_hex,
                    "display_order": index,
                    "is_published": True,
                },
            )

    skill_meters = [
        {
            "name": "HTML / Bootstrap",
            "percentage": 80,
            "color_hex": "#e34c26",
            "icon_class": "fa-brands fa-html5",
            "display_order": 1,
        },
        {
            "name": "CSS / CSS3",
            "percentage": 80,
            "color_hex": "#264de4",
            "icon_class": "fa-brands fa-css3-alt",
            "display_order": 2,
        },
        {
            "name": "JavaScript / jQuery / React",
            "percentage": 86,
            "color_hex": "#f7df1e",
            "icon_class": "fa-brands fa-js",
            "display_order": 3,
        },
        {
            "name": "Python / Django / Flask",
            "percentage": 68,
            "color_hex": "#3776ab",
            "icon_class": "fa-brands fa-python",
            "display_order": 4,
        },
        {
            "name": "SQL / NoSQL",
            "percentage": 50,
            "color_hex": "#0dcaf0",
            "icon_class": "fa-solid fa-database",
            "display_order": 5,
        },
        {
            "name": "Data Science / Machine Learning",
            "percentage": 55,
            "color_hex": "#a855f7",
            "icon_class": "fa-solid fa-chart-line",
            "display_order": 6,
        },
    ]

    for meter_data in skill_meters:
        SkillMeter.objects.get_or_create(
            name=meter_data["name"],
            defaults={
                **meter_data,
                "is_published": True,
            },
        )

    award, _created = Award.objects.get_or_create(
        title="Employee of the Year 2022",
        defaults={
            "issuer": "Städo AB",
            "description": (
                "Employee of the Year 2022 at Städo AB for outstanding "
                "performance as a Key Account Manager, demonstrating exceptional "
                "reliability and earning high appreciation from both clients and colleagues."
            ),
            "display_order": 1,
            "is_published": True,
        },
    )

    work_experiences = [
        {
            "title": "Career Transition",
            "organization": "",
            "experience_type": "other",
            "summary": "",
            "display_order": 1,
            "bullets": [
                "Worked on expanding my portfolio with new projects, including JuridiQ, a legal advisory web app built with Django REST Framework and React.",
                "Developed a salon booking system for a client using React frontend and Django backend.",
                "Participated in hackathons, including Code Institute’s Code to Protect: National Slavery and Human Trafficking Prevention Month, where I was Scrum Master.",
            ],
        },
        {
            "title": "Student",
            "organization": "Code Institute",
            "experience_type": "education",
            "summary": "Received Diploma in Full Stack Software Development Advanced Front End.",
            "display_order": 2,
            "bullets": [],
        },
        {
            "title": "Data Science Student",
            "organization": "",
            "experience_type": "data_science",
            "summary": (
                "Current studies focused on data science, machine learning, "
                "model evaluation and practical data-driven projects."
            ),
            "display_order": 3,
            "bullets": [],
        },
        {
            "title": "Military Service",
            "organization": "",
            "experience_type": "military",
            "summary": (
                "Military service experience with focus on discipline, structure, "
                "responsibility, teamwork and resilience."
            ),
            "display_order": 4,
            "bullets": [],
        },
        {
            "title": "Psychology Background",
            "organization": "",
            "experience_type": "psychology",
            "summary": (
                "Psychology-related background with focus on people, behavior, "
                "communication and human-centered thinking."
            ),
            "display_order": 5,
            "bullets": [],
        },
        {
            "title": "Key Account Manager",
            "organization": "Städo AB",
            "experience_type": "work",
            "summary": "",
            "display_order": 6,
            "bullets": [
                "Built and maintained strong relationships with key clients, ensuring their satisfaction and loyalty.",
                "Provided 24/7 availability for key client support and urgent issues.",
                "Customized solutions for client needs, including tailored booking management.",
                "Conducted job interviews to recruit new team members and maintain staffing needs.",
            ],
        },
        {
            "title": "Administrator",
            "organization": "Swebel Bygg AB",
            "experience_type": "work",
            "summary": "",
            "display_order": 7,
            "bullets": [
                "Managed and maintained documentation to ensure accuracy and accessibility.",
                "Supported staff with administrative and data-related requests.",
                "Provided basic data support, including troubleshooting and assisting with data entry and management.",
                "Coordinated staff inquiries and ensured efficient resolution of their needs.",
            ],
        },
        {
            "title": "Supervisor",
            "organization": "Städo AB",
            "experience_type": "work",
            "summary": "",
            "display_order": 8,
            "bullets": [
                "Managed inventory, monitored stock levels, and handled ordering of replenishments.",
                "Dispatched staff to assignments.",
            ],
        },
    ]

    for experience_data in work_experiences:
        bullets = experience_data.pop("bullets")

        experience, _created = WorkExperience.objects.get_or_create(
            title=experience_data["title"],
            organization=experience_data["organization"],
            defaults={
                **experience_data,
                "is_published": True,
            },
        )

        for index, bullet_text in enumerate(bullets, start=1):
            WorkExperienceBullet.objects.get_or_create(
                experience=experience,
                text=bullet_text,
                defaults={
                    "display_order": index,
                },
            )


def unseed_resume_defaults(apps, schema_editor):
    ResumeIntro = apps.get_model("resume", "ResumeIntro")
    SkillGroup = apps.get_model("resume", "SkillGroup")
    SkillMeter = apps.get_model("resume", "SkillMeter")
    WorkExperience = apps.get_model("resume", "WorkExperience")
    Award = apps.get_model("resume", "Award")

    ResumeIntro.objects.filter(title="Resume").delete()
    SkillGroup.objects.filter(
        name__in=[
            "Frontend",
            "Backend",
            "Data Science",
            "Tools",
            "Databases",
            "Psychology",
            "Military Service",
            "Creative Tools",
        ],
    ).delete()
    SkillMeter.objects.filter(
        name__in=[
            "HTML / Bootstrap",
            "CSS / CSS3",
            "JavaScript / jQuery / React",
            "Python / Django / Flask",
            "SQL / NoSQL",
            "Data Science / Machine Learning",
        ],
    ).delete()
    WorkExperience.objects.filter(
        title__in=[
            "Career Transition",
            "Student",
            "Data Science Student",
            "Military Service",
            "Psychology Background",
            "Key Account Manager",
            "Administrator",
            "Supervisor",
        ],
    ).delete()
    Award.objects.filter(title="Employee of the Year 2022").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("resume", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(seed_resume_defaults, unseed_resume_defaults),
    ]
