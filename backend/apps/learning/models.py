from django.conf import settings
from django.db import models
from apps.academics.models import Course, Lesson
from apps.common.models import BaseModel


class Enrollment(BaseModel):
    class Access(models.TextChoices):
        FREE = "free"
        PAID = "paid"          # used in Phase 2
        SCHOLARSHIP = "scholarship"

    class Status(models.TextChoices):
        ACTIVE = "active"
        COMPLETED = "completed"
        DROPPED = "dropped"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="enrollments")
    access_type = models.CharField(max_length=20, choices=Access.choices, default=Access.FREE)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.ACTIVE)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["user", "course"], name="uniq_user_course")]

    def __str__(self):
        return f"{self.user} -> {self.course}"


class LessonProgress(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="lesson_progress")
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name="progress")
    completed_at = models.DateTimeField(null=True, blank=True)
    time_spent_seconds = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["user", "lesson"], name="uniq_user_lesson")]
