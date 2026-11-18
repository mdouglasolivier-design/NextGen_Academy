from django.contrib import admin
from .models import Certificate


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("certificate_code", "user", "course", "status", "issued_at")
    list_filter = ("status",)
    search_fields = ("certificate_code", "user__email")
