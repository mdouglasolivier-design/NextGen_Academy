import secrets
from django.conf import settings
from django.db import models
from apps.academics.models import Course
from apps.common.models import BaseModel

CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"  # no confusing 0/O/1/I


def generate_code():
    return "UNI-" + "".join(secrets.choice(CODE_ALPHABET) for _ in range(8))


class Certificate(BaseModel):
    class Status(models.TextChoices):
        VALID = "valid"
        REVOKED = "revoked"

    certificate_code = models.CharField(max_length=20, unique=True, default=generate_code, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name="certificates")
    course = models.ForeignKey(Course, on_delete=models.PROTECT, related_name="certificates")
    final_score = models.DecimalField(max_digits=5, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.VALID)
    issued_at = models.DateTimeField(auto_now_add=True)
    revoked_reason = models.TextField(blank=True)
    pdf_url = models.URLField(blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["user", "course"], name="one_cert_per_user_course")]

    def __str__(self):
        return self.certificate_code
