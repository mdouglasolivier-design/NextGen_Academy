from django.conf import settings
from django.db import models
from apps.academics.models import Course, Module
from apps.common.models import BaseModel


class Quiz(BaseModel):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="quizzes")
    module = models.ForeignKey(Module, null=True, blank=True, on_delete=models.SET_NULL, related_name="quizzes")
    title = models.CharField(max_length=200)
    is_final_exam = models.BooleanField(default=False)
    time_limit_minutes = models.PositiveSmallIntegerField(null=True, blank=True)
    max_attempts = models.PositiveSmallIntegerField(default=3)
    pass_mark = models.PositiveSmallIntegerField(default=70)
    questions_per_attempt = models.PositiveSmallIntegerField(
        null=True, blank=True, help_text="Draw this many random questions from the bank"
    )

    class Meta:
        verbose_name_plural = "quizzes"

    def __str__(self):
        return self.title


class Question(BaseModel):
    class Type(models.TextChoices):
        SINGLE = "single"      # one correct option
        MULTIPLE = "multiple"  # several correct options
        TRUE_FALSE = "true_false"

    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="questions")
    text = models.TextField()
    question_type = models.CharField(max_length=20, choices=Type.choices, default=Type.SINGLE)
    explanation = models.TextField(blank=True)
    position = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.text[:60]


class Option(BaseModel):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="options")
    text = models.CharField(max_length=500)
    is_correct = models.BooleanField(default=False)  # never send to the frontend before submit

    def __str__(self):
        return self.text[:60]


class Attempt(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="attempts")
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name="attempts")
    question_ids = models.JSONField(default=list)   # questions drawn for this attempt
    answers = models.JSONField(default=dict)
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    passed = models.BooleanField(default=False)
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
