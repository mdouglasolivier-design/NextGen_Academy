from django.conf import settings
from django.db import models
from apps.common.models import BaseModel


class School(BaseModel):
    name = models.CharField(max_length=150)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Department(BaseModel):
    school = models.ForeignKey(School, on_delete=models.CASCADE, related_name="departments")
    name = models.CharField(max_length=150)

    def __str__(self):
        return f"{self.school.name} / {self.name}"


class Course(BaseModel):
    class Level(models.TextChoices):
        BEGINNER = "beginner"
        INTERMEDIATE = "intermediate"
        ADVANCED = "advanced"

    class Status(models.TextChoices):
        DRAFT = "draft"
        PUBLISHED = "published"

    department = models.ForeignKey(Department, on_delete=models.PROTECT, related_name="courses")
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    level = models.CharField(max_length=20, choices=Level.choices, default=Level.BEGINNER)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    pass_mark = models.PositiveSmallIntegerField(default=70)  # percent
    is_free = models.BooleanField(default=True)
    estimated_hours = models.PositiveSmallIntegerField(default=10)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL
    )
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.title


class Module(BaseModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="modules")
    title = models.CharField(max_length=200)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["position"]

    def __str__(self):
        return f"{self.course.title}: {self.title}"


class Lesson(BaseModel):
    class Type(models.TextChoices):
        READING = "reading"
        VIDEO = "video"
        EXERCISE = "exercise"  # reserved for the future IDE

    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name="lessons")
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True, help_text="Markdown")
    video_url = models.URLField(blank=True)
    lesson_type = models.CharField(max_length=20, choices=Type.choices, default=Type.READING)
    position = models.PositiveIntegerField(default=0)
    is_required = models.BooleanField(default=True)

    class Meta:
        ordering = ["position"]

    def __str__(self):
        return self.title
