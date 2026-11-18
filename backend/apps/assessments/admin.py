from django.contrib import admin
from .models import Attempt, Option, Question, Quiz


class OptionInline(admin.TabularInline):
    model = Option
    extra = 2


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ("text", "quiz", "question_type")
    inlines = [OptionInline]


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "is_final_exam", "max_attempts", "pass_mark")


admin.site.register(Attempt)
