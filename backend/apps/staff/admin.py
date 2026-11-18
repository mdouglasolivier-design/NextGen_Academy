from django.contrib import admin
from .models import AuditLog, StaffProfile


@admin.register(StaffProfile)
class StaffProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "role", "is_active", "last_active_at")
    list_filter = ("role", "is_active")


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("created_at", "user", "action", "ip_address")
    search_fields = ("action", "user__email")
    readonly_fields = [f.name for f in AuditLog._meta.fields]
