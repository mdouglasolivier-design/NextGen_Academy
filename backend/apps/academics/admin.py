from django.contrib import admin
from .models import Course, Department, Lesson, Module, School


class ModuleInline(admin.TabularInline):
    model = Module
    extra = 0


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "department", "status", "is_free", "pass_mark")
    list_filter = ("status", "is_free", "level")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [ModuleInline]


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "position")
    inlines = [LessonInline]


@admin.register(School)
class SchoolAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Department)
admin.site.register(Lesson)
