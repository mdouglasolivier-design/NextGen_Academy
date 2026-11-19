from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.academics.models import Course, Department, Lesson, Module, School
from apps.learning.models import Enrollment
from apps.staff import demo_data as demo
from apps.staff.models import StaffProfile

User = get_user_model()


class Command(BaseCommand):
    help = "Create demo staff logins, learners and courses for local development (DEBUG only)."

    def add_arguments(self, parser):
        parser.add_argument("--password", default=demo.DEMO_PASSWORD, help="Password for newly created demo accounts.")
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete the demo courses and create them again. This discards any edits you made to them.",
        )

    @transaction.atomic
    def handle(self, *args, **opts):
        if not settings.DEBUG:
            raise CommandError("seed_demo creates accounts with a known password, so it only runs when DEBUG=True.")

        if opts["reset"]:
            slugs = [c["slug"] for c in demo.COURSES]
            deleted, _ = Course.objects.filter(slug__in=slugs).delete()
            self.stdout.write(f"Removed {deleted} demo course records.")

        instructor = self._staff(opts["password"])
        learners = self._learners(opts["password"])
        created = self._courses(instructor)
        self._enrollments(learners)

        self.stdout.write(self.style.SUCCESS("\nDemo data is ready."))
        self.stdout.write(f"Courses: {created} new, {len(demo.COURSES) - created} already existed (left untouched).")
        self.stdout.write("\nStaff logins (at /staff-login):")
        for role, email, _name in demo.STAFF:
            self.stdout.write(f"  {role:<12} {email}")
        self.stdout.write(f"\nPassword for accounts created by this run: {opts['password']}")

    def _user(self, email, full_name, country, password, verified=True):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "full_name": full_name,
                "country": country,
                "email_verified_at": timezone.now() if verified else None,
            },
        )
        if created:
            user.set_password(password)
            user.save(update_fields=["password"])
        return user

    def _staff(self, password):
        instructor = None
        for role, email, name in demo.STAFF:
            user = self._user(email, name, "Rwanda", password)
            StaffProfile.objects.get_or_create(user=user, defaults={"role": role})
            if role == "instructor":
                instructor = user
        return instructor

    def _learners(self, password):
        return {
            email: self._user(email, name, country, password, verified)
            for name, email, country, verified in demo.LEARNERS
        }

    def _courses(self, instructor):
        school, _ = School.objects.get_or_create(
            slug="nextgen-academy",
            defaults={"name": "NextGen Academy", "description": "Free courses with verifiable certificates."},
        )
        departments = {name: Department.objects.get_or_create(school=school, name=name)[0] for name in demo.DEPARTMENTS}

        created = 0
        for spec in demo.COURSES:
            course, is_new = Course.objects.get_or_create(
                slug=spec["slug"],
                defaults={
                    "department": departments[spec["department"]],
                    "title": spec["title"],
                    "description": spec["description"],
                    "level": spec["level"],
                    "status": spec["status"],
                    "estimated_hours": spec["hours"],
                    "is_free": True,
                    "created_by": instructor,
                },
            )
            if not is_new:
                continue  # keep the user's edits
            created += 1
            for m_pos, (m_title, lessons) in enumerate(spec["modules"], start=1):
                module = Module.objects.create(course=course, title=m_title, position=m_pos)
                for l_pos, (l_title, content) in enumerate(lessons, start=1):
                    Lesson.objects.create(module=module, title=l_title, content=content, position=l_pos)
        return created

    def _enrollments(self, learners):
        now = timezone.now()
        for email, plan in demo.ENROLLMENTS.items():
            for slug, status in plan:
                course = Course.objects.filter(slug=slug).first()
                if not course:
                    continue
                Enrollment.objects.get_or_create(
                    user=learners[email],
                    course=course,
                    defaults={"status": status, "completed_at": now if status == "completed" else None},
                )
