import pytest
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_unknown_certificate_returns_404():
    res = APIClient().get("/api/verify/UNI-NOTREAL/")
    assert res.status_code == 404
