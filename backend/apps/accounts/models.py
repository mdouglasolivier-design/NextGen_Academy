from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from apps.common.models import BaseModel


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create(self, email, password, **extra):
        if not email:
            raise ValueError("Email is required")
        user = self.model(email=self.normalize_email(email), **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        return self._create(email, password, **extra)

    def create_superuser(self, email, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        return self._create(email, password, **extra)


class User(AbstractUser, BaseModel):
    username = None
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=150)
    country = models.CharField(max_length=80, blank=True)
    email_verified_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)  # soft delete

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]
    objects = UserManager()

    def __str__(self):
        return self.email


class Profile(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    bio = models.TextField(blank=True)
    avatar_url = models.URLField(blank=True)
    language = models.CharField(max_length=10, default="en")
    timezone = models.CharField(max_length=50, default="Africa/Kigali")

    def __str__(self):
        return f"Profile of {self.user.email}"
