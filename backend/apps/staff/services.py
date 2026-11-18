from datetime import timedelta
from django.contrib.auth import get_user_model
from django.db.models import Avg
from django.utils import timezone
from apps.academics.models import Course
from apps.assessments.models import Attempt
from apps.learning.models import Enrollment
from .models import AuditLog

User = get_user_model()


def get_role(user):
    """Staff role of the user, or None. Django superusers count as super_admin."""
    if not user or not user.is_authenticated:
        return None
    profile = getattr(user, "staff_profile", None)
    if profile and profile.is_active:
        return profile.role
    return "super_admin" if user.is_superuser else None


def log_action(user, action, detail="", request=None):
    ip = request.META.get("REMOTE_ADDR") if request else None
    AuditLog.objects.create(user=user, action=action, detail=detail, ip_address=ip)


def _pct(part, whole):
    return round(100 * part / whole, 1) if whole else 0


def kpi_values(role, user):
    """Return {kpi_key: value}. Missing keys are shown as '—' (module not built yet)."""
    now = timezone.now()
    if role == "super_admin":
        learners = User.objects.filter(is_staff=False, staff_profile__isnull=True)
        enr = Enrollment.objects.all()
        return {
            "total_users": User.objects.count(),
            "signups_today": learners.filter(created_at__gte=now - timedelta(days=1)).count(),
            "signups_week": learners.filter(created_at__gte=now - timedelta(days=7)).count(),
            "signups_month": learners.filter(created_at__gte=now - timedelta(days=30)).count(),
            "active_now": User.objects.filter(last_login__gte=now - timedelta(minutes=15)).count(),
            "courses_published": Course.objects.filter(status="published").count(),
            "courses_draft": Course.objects.filter(status="draft").count(),
            "total_enrollments": enr.count(),
            "completion_rate": _pct(enr.filter(status="completed").count(), enr.count()),
        }
    if role == "instructor":
        enr = Enrollment.objects.filter(course__created_by=user)
        avg = Attempt.objects.filter(quiz__course__created_by=user, submitted_at__isnull=False).aggregate(a=Avg("score"))["a"]
        return {
            "total_learners": enr.values("user").distinct().count(),
            "enrollments_week": enr.filter(created_at__gte=now - timedelta(days=7)).count(),
            "completion_rate": _pct(enr.filter(status="completed").count(), enr.count()),
            "avg_quiz_score": round(float(avg), 1) if avg is not None else 0,
        }
    if role == "reviewer":
        return {"pending_reviews": Course.objects.filter(status="draft").count()}
    return {}  # moderator, support: modules not built yet


def today_items(role, user):
    """The 'Today' panel: things needing action now."""
    if role == "super_admin":
        return [
            {"label": "Accounts awaiting email verification",
             "count": User.objects.filter(email_verified_at__isnull=True, staff_profile__isnull=True, is_staff=False).count()},
            {"label": "Draft courses", "count": Course.objects.filter(status="draft").count()},
        ]
    if role == "instructor":
        return [{"label": "Drafts awaiting submission", "count": Course.objects.filter(created_by=user, status="draft").count()}]
    if role == "reviewer":
        return [{"label": "Draft courses to review", "count": Course.objects.filter(status="draft").count()}]
    return []
