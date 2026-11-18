from django.conf import settings
from django.db import models
from apps.common.models import BaseModel


class StaffProfile(BaseModel):
    class Role(models.TextChoices):
        SUPER_ADMIN = "super_admin", "Super Admin / Platform Owner"
        INSTRUCTOR = "instructor", "Course Creator / Instructor"
        REVIEWER = "reviewer", "Content Reviewer / Editor"
        MODERATOR = "moderator", "Community Moderator"
        SUPPORT = "support", "Support Agent"

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="staff_profile")
    role = models.CharField(max_length=20, choices=Role.choices)
    is_active = models.BooleanField(default=True)
    last_active_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} ({self.role})"


class AuditLog(BaseModel):
    """Who did what, when, from where. Powers 'My activity log' and the Super Admin audit log."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL, related_name="audit_entries")
    action = models.CharField(max_length=100)
    detail = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
