from django.utils import timezone
from rest_framework.response import Response
from rest_framework.views import APIView
from .dashboards import DASHBOARDS, KPI_LABELS
from .models import AuditLog
from .permissions import IsStaffMember
from .services import get_role, kpi_values, today_items


class DashboardView(APIView):
    permission_classes = [IsStaffMember]

    def get(self, request):
        user = request.user
        role = get_role(user)
        cfg = DASHBOARDS[role]
        if hasattr(user, "staff_profile"):
            user.staff_profile.last_active_at = timezone.now()
            user.staff_profile.save(update_fields=["last_active_at"])
        values = kpi_values(role, user)
        return Response({
            "role": role,
            "role_title": cfg["title"],
            "user": {"name": user.full_name, "email": user.email},
            "session": {"last_login": user.last_login},
            "kpis": [{"key": k, "label": KPI_LABELS[k], "value": values.get(k)} for k in cfg["kpis"]],
            "today": today_items(role, user),
            "sections": cfg["sections"],
        })


class MyActivityView(APIView):
    permission_classes = [IsStaffMember]

    def get(self, request):
        rows = AuditLog.objects.filter(user=request.user)[:50]
        return Response([{"action": r.action, "detail": r.detail, "at": r.created_at, "ip": r.ip_address} for r in rows])
