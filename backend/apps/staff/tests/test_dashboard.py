import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_learner_cannot_open_staff_dashboard():
    user = get_user_model().objects.create_user(email="a@b.com", password="x12345678", full_name="A")
    client = APIClient()
    client.force_authenticate(user)
    assert client.get("/api/staff/dashboard/").status_code == 403


@pytest.mark.django_db
def test_superuser_gets_super_admin_dashboard():
    user = get_user_model().objects.create_superuser(email="s@b.com", password="x12345678", full_name="S")
    client = APIClient()
    client.force_authenticate(user)
    res = client.get("/api/staff/dashboard/")
    assert res.status_code == 200 and res.data["role"] == "super_admin"
