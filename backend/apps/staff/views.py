from django.db.models import Count, Q
from django.utils import timezone
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView
from apps.academics.models import Course
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


COURSE_ROLES = {"super_admin", "instructor", "reviewer"}


class StaffCourseListView(APIView):
    """Courses a staff member may see: instructors their own, admins and reviewers all (drafts included)."""

    permission_classes = [IsStaffMember]

    def get(self, request):
        role = get_role(request.user)
        if role not in COURSE_ROLES:
            raise PermissionDenied("Your role does not include course management.")
        courses = Course.objects.filter(deleted_at__isnull=True)
        if role == "instructor":
            courses = courses.filter(created_by=request.user)
        status = request.query_params.get("status")
        if status in {Course.Status.DRAFT, Course.Status.PUBLISHED}:
            courses = courses.filter(status=status)
        courses = courses.select_related("created_by").annotate(
            module_count=Count("modules", distinct=True),
            lesson_count=Count("modules__lessons", distinct=True),
            learner_count=Count("enrollments", distinct=True),
            completed_count=Count("enrollments", filter=Q(enrollments__status="completed"), distinct=True),
        ).order_by("-updated_at")
        return Response([
            {
                "id": str(c.id),
                "title": c.title,
                "slug": c.slug,
                "status": c.status,
                "level": c.level,
                "estimated_hours": c.estimated_hours,
                "modules": c.module_count,
                "lessons": c.lesson_count,
                "learners": c.learner_count,
                "completed": c.completed_count,
                "instructor": c.created_by.full_name if c.created_by else None,
                "updated_at": c.updated_at,
            }
            for c in courses
        ])
