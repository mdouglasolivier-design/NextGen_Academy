from django.contrib import admin
from .models import Enrollment, LessonProgress

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "status", "access_type", "created_at")
    list_filter = ("status", "access_type")

admin.site.register(LessonProgress)
