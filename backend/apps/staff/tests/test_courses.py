import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.academics.models import Course, Department, Module, School
from apps.staff.models import StaffProfile

User = get_user_model()


def make_staff(role, email):
    user = User.objects.create_user(email=email, password="x12345678", full_name=role.title())
    StaffProfile.objects.create(user=user, role=role)
    return user


def client_for(user):
    client = APIClient()
    client.force_authenticate(user)
    return client


@pytest.fixture
def courses(db):
    dept = Department.objects.create(school=School.objects.create(name="S", slug="s"), name="D")
    mine = make_staff("instructor", "mine@b.com")
    other = make_staff("instructor", "other@b.com")
    own = Course.objects.create(department=dept, title="Mine", slug="mine", created_by=mine, status="draft")
    Module.objects.create(course=own, title="M1", position=1)
    Course.objects.create(department=dept, title="Theirs", slug="theirs", created_by=other, status="published")
    Course.objects.create(department=dept, title="Gone", slug="gone", created_by=mine, deleted_at="2026-01-01T00:00:00Z")
    return mine


def titles(res):
    return {row["title"] for row in res.data}


def test_instructor_sees_only_their_own_courses(courses):
    res = client_for(courses).get("/api/staff/courses/")
    assert res.status_code == 200
    assert titles(res) == {"Mine"}
    assert res.data[0]["modules"] == 1


def test_reviewer_and_admin_see_all_live_courses(courses):
    for role in ("reviewer", "super_admin"):
        res = client_for(make_staff(role, f"{role}@b.com")).get("/api/staff/courses/")
        assert titles(res) == {"Mine", "Theirs"}


def test_status_filter_returns_drafts_only(courses):
    res = client_for(make_staff("reviewer", "r@b.com")).get("/api/staff/courses/?status=draft")
    assert titles(res) == {"Mine"}


@pytest.mark.parametrize("role", ["moderator", "support"])
def test_roles_without_course_access_are_refused(db, role):
    assert client_for(make_staff(role, f"{role}@b.com")).get("/api/staff/courses/").status_code == 403


def test_learner_is_refused(db):
    learner = User.objects.create_user(email="l@b.com", password="x12345678", full_name="L")
    assert client_for(learner).get("/api/staff/courses/").status_code == 403


def test_anonymous_is_refused(db):
    assert APIClient().get("/api/staff/courses/").status_code in (401, 403)
