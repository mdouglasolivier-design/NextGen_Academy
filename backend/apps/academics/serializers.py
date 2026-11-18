from rest_framework import serializers
from .models import Course, Lesson, Module


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ("id", "title", "content", "video_url", "lesson_type", "position", "is_required")


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = ("id", "title", "position", "lessons")


class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "title", "slug", "description", "level", "estimated_hours", "is_free")


class CourseDetailSerializer(CourseListSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta(CourseListSerializer.Meta):
        fields = CourseListSerializer.Meta.fields + ("pass_mark", "modules")
