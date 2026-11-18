from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Profile, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    ordering = ("email",)
    list_display = ("email", "full_name", "is_staff", "email_verified_at")
    search_fields = ("email", "full_name")
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal", {"fields": ("full_name", "country", "email_verified_at")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "full_name", "password1", "password2")}),
    )


admin.site.register(Profile)
