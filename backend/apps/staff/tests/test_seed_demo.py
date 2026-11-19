import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from apps.academics.models import Course
from apps.learning.models import Enrollment
from apps.staff import demo_data as demo
from apps.staff.models import StaffProfile


@pytest.fixture(autouse=True)
def debug_on(settings):
    settings.DEBUG = True


@pytest.mark.django_db
def test_seed_creates_one_login_per_role_and_the_courses():
    call_command("seed_demo", verbosity=0)
    roles = set(StaffProfile.objects.values_list("role", flat=True))
    assert roles == {"super_admin", "instructor", "reviewer", "moderator", "support"}
    assert Course.objects.filter(status="published").count() == 4
    assert Course.objects.filter(status="draft").count() == 2
    assert Enrollment.objects.count() > 0


@pytest.mark.django_db
def test_seed_is_safe_to_run_twice_and_keeps_edits():
    call_command("seed_demo", verbosity=0)
    Course.objects.filter(slug="python-for-beginners").update(title="My own title")
    before = (Course.objects.count(), Enrollment.objects.count(), StaffProfile.objects.count())

    call_command("seed_demo", verbosity=0)

    assert (Course.objects.count(), Enrollment.objects.count(), StaffProfile.objects.count()) == before
    assert Course.objects.get(slug="python-for-beginners").title == "My own title"


@pytest.mark.django_db
def test_reset_restores_the_demo_courses():
    call_command("seed_demo", verbosity=0)
    Course.objects.filter(slug="python-for-beginners").update(title="My own title")
    call_command("seed_demo", "--reset", verbosity=0)
    assert Course.objects.get(slug="python-for-beginners").title == "Python for Beginners"


@pytest.mark.django_db
def test_seed_refuses_to_run_outside_debug(settings):
    settings.DEBUG = False
    with pytest.raises(CommandError):
        call_command("seed_demo", verbosity=0)
    assert not StaffProfile.objects.exists()


def test_every_demo_course_has_lessons():
    for course in demo.COURSES:
        assert course["modules"] and all(lessons for _, lessons in course["modules"]), course["slug"]
