# NextGen Academy - staff dashboards, staff sign-ins and demo courses
# Run from the repo root (the folder that contains backend and frontend).
$ErrorActionPreference='Stop'
function W($p,$c){ $c=[regex]::Replace($c,'@@U([0-9A-F]{4,5})@@',{param($m)[char]::ConvertFromUtf32([Convert]::ToInt32($m.Groups[1].Value,16))}); $d=Split-Path $p -Parent; if($d){New-Item -ItemType Directory -Force $d|Out-Null}; [IO.File]::WriteAllText((Join-Path (Get-Location) $p),$c.Replace("`r`n","`n"),(New-Object Text.UTF8Encoding $false)) }

W 'README.md' @'
# University Platform (Phase 1: Free Certificates)

Stack: Django + DRF (backend) @@U00B7@@ Next.js + TypeScript (frontend) @@U00B7@@ PostgreSQL

## Run the backend
    cd backend
    python -m venv .venv
    source .venv/bin/activate        # Windows: .venv\Scripts\activate
    pip install -r requirements/dev.txt
    cp .env.example .env
    python manage.py makemigrations accounts common academics learning assessments certificates staff
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver

Admin: http://localhost:8000/admin/   API docs: http://localhost:8000/api/docs/

## Run the frontend
    cd frontend
    npm install
    npm run dev

Frontend: http://localhost:3000

## Demo data (local development only)
    cd backend
    python manage.py seed_demo

Creates one staff login per role, a few learners with enrollments, and six demo courses (four published, two drafts).
Re-running it is safe: courses that already exist are left alone, so your edits are kept. Use `--reset` to bring the
demo courses back to their original content. It refuses to run unless `DEBUG=True`.

| Role | Sign-in page | Email |
|------|--------------|-------|
| Super admin | /staff-login/admin | admin@nextgen.test |
| Instructor | /staff-login/instructor | instructor@nextgen.test |
| Reviewer | /staff-login/reviewer | reviewer@nextgen.test |
| Moderator | /staff-login/moderator | moderator@nextgen.test |
| Support | /staff-login/support | support@nextgen.test |

Password for all demo accounts: `NextGen-Demo-2026`

'@

W 'backend/apps/staff/demo_data.py' @'
"""Demo content for local development. Edit freely: `seed_demo` never overwrites a course that already exists
(unless you pass --reset), so your changes in the admin or the future course builder are safe."""

DEMO_PASSWORD = "NextGen-Demo-2026"

# One login per staff role. Emails use the reserved .test domain, so they can never be real addresses.
STAFF = [
    ("super_admin", "admin@nextgen.test", "Alice Admin"),
    ("instructor", "instructor@nextgen.test", "Ian Instructor"),
    ("reviewer", "reviewer@nextgen.test", "Rita Reviewer"),
    ("moderator", "moderator@nextgen.test", "Moses Moderator"),
    ("support", "support@nextgen.test", "Sandra Support"),
]

# (full name, email, country, email verified?)
LEARNERS = [
    ("Aline Uwase", "aline@nextgen.test", "Rwanda", True),
    ("Eric Mugisha", "eric@nextgen.test", "Rwanda", True),
    ("Grace Achieng", "grace@nextgen.test", "Kenya", True),
    ("David Okello", "david@nextgen.test", "Uganda", True),
    ("Chantal Ingabire", "chantal@nextgen.test", "Rwanda", True),
    ("Joseph Habimana", "joseph@nextgen.test", "Rwanda", False),
    ("Mary Wanjiru", "mary@nextgen.test", "Kenya", True),
    ("Patrick Niyonzima", "patrick@nextgen.test", "Rwanda", False),
]

DEPARTMENTS = ["Computing", "Business and Life Skills"]

# Enrollment plan: learner email -> [(course slug, "active" | "completed")]
ENROLLMENTS = {
    "aline@nextgen.test": [("web-development-basics", "completed"), ("python-for-beginners", "active")],
    "eric@nextgen.test": [("web-development-basics", "active"), ("entrepreneurship-basics", "active")],
    "grace@nextgen.test": [("python-for-beginners", "completed"), ("digital-skills-for-work", "completed")],
    "david@nextgen.test": [("digital-skills-for-work", "active")],
    "chantal@nextgen.test": [("entrepreneurship-basics", "completed"), ("web-development-basics", "active")],
    "mary@nextgen.test": [("python-for-beginners", "active")],
}

# Each course: modules -> lessons as (title, markdown content).
COURSES = [
    {
        "slug": "web-development-basics",
        "title": "Web Development Basics",
        "department": "Computing",
        "level": "beginner",
        "hours": 12,
        "status": "published",
        "description": (
            "Learn how websites work and build your first page from scratch. "
            "You will write HTML for structure, CSS for style and a little JavaScript for behaviour."
        ),
        "modules": [
            ("How the web works", [
                ("What happens when you open a website",
                 "When you type an address, your browser asks a **server** for the page. The server sends back "
                 "**HTML** (the content), **CSS** (the look) and **JavaScript** (the behaviour). "
                 "Your browser puts them together and shows the page."),
                ("HTML: the structure of a page",
                 "HTML uses **tags** to describe content: headings, paragraphs, links and images.\n\n"
                 "```html\n<h1>My first page</h1>\n<p>Hello from Kigali.</p>\n<a href=\"/about\">About me</a>\n```"),
            ]),
            ("Styling and interaction", [
                ("CSS: making it look right",
                 "CSS chooses elements and changes how they look.\n\n"
                 "```css\nh1 { color: #1e5bd0; font-size: 2rem; }\n```\n\n"
                 "Practice: change the colour and size of the heading on your page."),
                ("JavaScript: making it do things",
                 "JavaScript reacts to what the visitor does. A button click can change text on the page.\n\n"
                 "```js\ndocument.querySelector('button').onclick = () => alert('Hello!');\n```"),
            ]),
        ],
    },
    {
        "slug": "python-for-beginners",
        "title": "Python for Beginners",
        "department": "Computing",
        "level": "beginner",
        "hours": 15,
        "status": "published",
        "description": (
            "Start programming with Python, one of the most beginner-friendly languages. "
            "You will store data, make decisions and repeat work with loops."
        ),
        "modules": [
            ("First steps", [
                ("Installing Python and running code",
                 "Download Python from python.org, then open a terminal and type `python`. "
                 "You can now run code one line at a time.\n\n```python\nprint('Hello, world')\n```"),
                ("Variables and data types",
                 "A **variable** is a name for a value. Python has text (`str`), whole numbers (`int`), "
                 "decimals (`float`) and true/false values (`bool`).\n\n"
                 "```python\nname = 'Aline'\nage = 21\n```"),
            ]),
            ("Making decisions", [
                ("Conditions with if and else",
                 "Use `if` to run code only when something is true.\n\n"
                 "```python\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')\n```"),
                ("Repeating work with loops",
                 "A `for` loop repeats code for each item in a list.\n\n"
                 "```python\nfor n in [1, 2, 3]:\n    print(n * 2)\n```"),
            ]),
        ],
    },
    {
        "slug": "digital-skills-for-work",
        "title": "Digital Skills for Work",
        "department": "Business and Life Skills",
        "level": "beginner",
        "hours": 8,
        "status": "published",
        "description": (
            "The everyday computer skills every workplace expects: staying safe online, "
            "writing clear emails and keeping files organised."
        ),
        "modules": [
            ("Working online safely", [
                ("Strong passwords and two-step sign-in",
                 "Use a long password you do not use anywhere else, such as four random words. "
                 "Turn on **two-step sign-in** so a stolen password alone is not enough."),
                ("Spotting phishing messages",
                 "Phishing messages pretend to be a bank or a boss and push you to click quickly. "
                 "Check the sender address, hover over links before clicking, and never share a code sent to your phone."),
            ]),
            ("Working with others", [
                ("Writing clear emails",
                 "Put the request in the first line, keep paragraphs short, and use a subject that says what you need. "
                 "Read it once before sending."),
                ("Sharing and organising files",
                 "Name files so anyone can find them, for example `2026-03-budget-v2`. "
                 "Share a link instead of attaching copies, so everyone sees the latest version."),
            ]),
        ],
    },
    {
        "slug": "entrepreneurship-basics",
        "title": "Entrepreneurship Basics",
        "department": "Business and Life Skills",
        "level": "intermediate",
        "hours": 10,
        "status": "published",
        "description": (
            "Turn an idea into something customers want. Learn to find a real problem, "
            "talk to customers, understand your costs and pitch in two minutes."
        ),
        "modules": [
            ("From idea to customer", [
                ("Finding a problem worth solving",
                 "Good businesses solve a problem people already have and will pay to fix. "
                 "List five problems you or people near you face, then pick the one that is most frequent and most painful."),
                ("Talking to customers before you build",
                 "Ask ten people about how they deal with the problem today. Listen for what they already pay for or work around. "
                 "Do not pitch your idea yet. You are collecting facts."),
            ]),
            ("Money basics", [
                ("Costs, prices and profit",
                 "**Profit = income - costs.** Add up fixed costs (rent) and variable costs (materials per item), "
                 "then set a price that covers both and leaves something for you."),
                ("Pitching your idea in two minutes",
                 "Cover four things: the problem, your solution, who it is for, and how you make money. "
                 "Practise out loud with a timer."),
            ]),
        ],
    },
    {
        "slug": "data-analysis-with-spreadsheets",
        "title": "Data Analysis with Spreadsheets",
        "department": "Computing",
        "level": "intermediate",
        "hours": 14,
        "status": "draft",
        "description": "Clean, summarise and chart data using formulas and pivot tables. Draft: waiting for review.",
        "modules": [
            ("Spreadsheet foundations", [
                ("Cells, rows and formulas",
                 "A formula starts with `=`. For example `=SUM(B2:B10)` adds the numbers in those cells."),
            ]),
        ],
    },
    {
        "slug": "introduction-to-cybersecurity",
        "title": "Introduction to Cybersecurity",
        "department": "Computing",
        "level": "intermediate",
        "hours": 16,
        "status": "draft",
        "description": "How attackers get in and how to stop them. Draft: still being written.",
        "modules": [
            ("Threats and defences", [
                ("Common attacks explained",
                 "Most attacks are simple: guessed passwords, tricked users and unpatched software. "
                 "Defence starts with updates, unique passwords and two-step sign-in."),
            ]),
        ],
    },
]

'@

W 'backend/apps/staff/management/__init__.py' @'

'@

W 'backend/apps/staff/management/commands/__init__.py' @'

'@

W 'backend/apps/staff/management/commands/seed_demo.py' @'
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.academics.models import Course, Department, Lesson, Module, School
from apps.learning.models import Enrollment
from apps.staff import demo_data as demo
from apps.staff.models import StaffProfile

User = get_user_model()


class Command(BaseCommand):
    help = "Create demo staff logins, learners and courses for local development (DEBUG only)."

    def add_arguments(self, parser):
        parser.add_argument("--password", default=demo.DEMO_PASSWORD, help="Password for newly created demo accounts.")
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete the demo courses and create them again. This discards any edits you made to them.",
        )

    @transaction.atomic
    def handle(self, *args, **opts):
        if not settings.DEBUG:
            raise CommandError("seed_demo creates accounts with a known password, so it only runs when DEBUG=True.")

        if opts["reset"]:
            slugs = [c["slug"] for c in demo.COURSES]
            deleted, _ = Course.objects.filter(slug__in=slugs).delete()
            self.stdout.write(f"Removed {deleted} demo course records.")

        instructor = self._staff(opts["password"])
        learners = self._learners(opts["password"])
        created = self._courses(instructor)
        self._enrollments(learners)

        self.stdout.write(self.style.SUCCESS("\nDemo data is ready."))
        self.stdout.write(f"Courses: {created} new, {len(demo.COURSES) - created} already existed (left untouched).")
        self.stdout.write("\nStaff logins (at /staff-login):")
        for role, email, _name in demo.STAFF:
            self.stdout.write(f"  {role:<12} {email}")
        self.stdout.write(f"\nPassword for accounts created by this run: {opts['password']}")

    def _user(self, email, full_name, country, password, verified=True):
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "full_name": full_name,
                "country": country,
                "email_verified_at": timezone.now() if verified else None,
            },
        )
        if created:
            user.set_password(password)
            user.save(update_fields=["password"])
        return user

    def _staff(self, password):
        instructor = None
        for role, email, name in demo.STAFF:
            user = self._user(email, name, "Rwanda", password)
            StaffProfile.objects.get_or_create(user=user, defaults={"role": role})
            if role == "instructor":
                instructor = user
        return instructor

    def _learners(self, password):
        return {
            email: self._user(email, name, country, password, verified)
            for name, email, country, verified in demo.LEARNERS
        }

    def _courses(self, instructor):
        school, _ = School.objects.get_or_create(
            slug="nextgen-academy",
            defaults={"name": "NextGen Academy", "description": "Free courses with verifiable certificates."},
        )
        departments = {name: Department.objects.get_or_create(school=school, name=name)[0] for name in demo.DEPARTMENTS}

        created = 0
        for spec in demo.COURSES:
            course, is_new = Course.objects.get_or_create(
                slug=spec["slug"],
                defaults={
                    "department": departments[spec["department"]],
                    "title": spec["title"],
                    "description": spec["description"],
                    "level": spec["level"],
                    "status": spec["status"],
                    "estimated_hours": spec["hours"],
                    "is_free": True,
                    "created_by": instructor,
                },
            )
            if not is_new:
                continue  # keep the user's edits
            created += 1
            for m_pos, (m_title, lessons) in enumerate(spec["modules"], start=1):
                module = Module.objects.create(course=course, title=m_title, position=m_pos)
                for l_pos, (l_title, content) in enumerate(lessons, start=1):
                    Lesson.objects.create(module=module, title=l_title, content=content, position=l_pos)
        return created

    def _enrollments(self, learners):
        now = timezone.now()
        for email, plan in demo.ENROLLMENTS.items():
            for slug, status in plan:
                course = Course.objects.filter(slug=slug).first()
                if not course:
                    continue
                Enrollment.objects.get_or_create(
                    user=learners[email],
                    course=course,
                    defaults={"status": status, "completed_at": now if status == "completed" else None},
                )

'@

W 'backend/apps/staff/tests/test_courses.py' @'
import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from apps.academics.models import Course, Department, Module, School
from apps.staff.models import StaffProfile

User = get_user_model()


def make_staff(role, email):
    user = User.objects.create_user(email=email, password="x12345678", full_name=role.title())
    StaffProfile.objects.create(user=user, role=role)
    return user


def client_for(user):
    client = APIClient()
    client.force_authenticate(user)
    return client


@pytest.fixture
def courses(db):
    dept = Department.objects.create(school=School.objects.create(name="S", slug="s"), name="D")
    mine = make_staff("instructor", "mine@b.com")
    other = make_staff("instructor", "other@b.com")
    own = Course.objects.create(department=dept, title="Mine", slug="mine", created_by=mine, status="draft")
    Module.objects.create(course=own, title="M1", position=1)
    Course.objects.create(department=dept, title="Theirs", slug="theirs", created_by=other, status="published")
    Course.objects.create(department=dept, title="Gone", slug="gone", created_by=mine, deleted_at="2026-01-01T00:00:00Z")
    return mine


def titles(res):
    return {row["title"] for row in res.data}


def test_instructor_sees_only_their_own_courses(courses):
    res = client_for(courses).get("/api/staff/courses/")
    assert res.status_code == 200
    assert titles(res) == {"Mine"}
    assert res.data[0]["modules"] == 1


def test_reviewer_and_admin_see_all_live_courses(courses):
    for role in ("reviewer", "super_admin"):
        res = client_for(make_staff(role, f"{role}@b.com")).get("/api/staff/courses/")
        assert titles(res) == {"Mine", "Theirs"}


def test_status_filter_returns_drafts_only(courses):
    res = client_for(make_staff("reviewer", "r@b.com")).get("/api/staff/courses/?status=draft")
    assert titles(res) == {"Mine"}


@pytest.mark.parametrize("role", ["moderator", "support"])
def test_roles_without_course_access_are_refused(db, role):
    assert client_for(make_staff(role, f"{role}@b.com")).get("/api/staff/courses/").status_code == 403


def test_learner_is_refused(db):
    learner = User.objects.create_user(email="l@b.com", password="x12345678", full_name="L")
    assert client_for(learner).get("/api/staff/courses/").status_code == 403


def test_anonymous_is_refused(db):
    assert APIClient().get("/api/staff/courses/").status_code in (401, 403)

'@

W 'backend/apps/staff/tests/test_seed_demo.py' @'
import pytest
from django.core.management import call_command
from django.core.management.base import CommandError

from apps.academics.models import Course
from apps.learning.models import Enrollment
from apps.staff import demo_data as demo
from apps.staff.models import StaffProfile


@pytest.fixture(autouse=True)
def debug_on(settings):
    settings.DEBUG = True


@pytest.mark.django_db
def test_seed_creates_one_login_per_role_and_the_courses():
    call_command("seed_demo", verbosity=0)
    roles = set(StaffProfile.objects.values_list("role", flat=True))
    assert roles == {"super_admin", "instructor", "reviewer", "moderator", "support"}
    assert Course.objects.filter(status="published").count() == 4
    assert Course.objects.filter(status="draft").count() == 2
    assert Enrollment.objects.count() > 0


@pytest.mark.django_db
def test_seed_is_safe_to_run_twice_and_keeps_edits():
    call_command("seed_demo", verbosity=0)
    Course.objects.filter(slug="python-for-beginners").update(title="My own title")
    before = (Course.objects.count(), Enrollment.objects.count(), StaffProfile.objects.count())

    call_command("seed_demo", verbosity=0)

    assert (Course.objects.count(), Enrollment.objects.count(), StaffProfile.objects.count()) == before
    assert Course.objects.get(slug="python-for-beginners").title == "My own title"


@pytest.mark.django_db
def test_reset_restores_the_demo_courses():
    call_command("seed_demo", verbosity=0)
    Course.objects.filter(slug="python-for-beginners").update(title="My own title")
    call_command("seed_demo", "--reset", verbosity=0)
    assert Course.objects.get(slug="python-for-beginners").title == "Python for Beginners"


@pytest.mark.django_db
def test_seed_refuses_to_run_outside_debug(settings):
    settings.DEBUG = False
    with pytest.raises(CommandError):
        call_command("seed_demo", verbosity=0)
    assert not StaffProfile.objects.exists()


def test_every_demo_course_has_lessons():
    for course in demo.COURSES:
        assert course["modules"] and all(lessons for _, lessons in course["modules"]), course["slug"]

'@

W 'backend/apps/staff/urls.py' @'
from django.urls import path
from .views import DashboardView, MyActivityView, StaffCourseListView

urlpatterns = [
    path("staff/dashboard/", DashboardView.as_view()),
    path("staff/activity/", MyActivityView.as_view()),
    path("staff/courses/", StaffCourseListView.as_view()),
]

'@

W 'backend/apps/staff/views.py' @'
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

'@

W 'frontend/src/app/(auth)/login/page.tsx' @'
import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your courses and download your certificates."
      footer={
        <>
          New here?{" "}
          <Link href="/register" className="font-semibold text-spine-blue hover:text-blue-deep">
            Create account
          </Link>
        </>
      }
    >
      <LoginForm next={Array.isArray(next) ? next[0] : next} />
    </AuthShell>
  );
}

'@

W 'frontend/src/app/(public)/about/page.tsx' @'
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-4xl font-bold sm:text-5xl">Learning that opens doors</h1>
      <div className="mt-8 space-y-5 text-lg text-ink-soft">
        <p>
          NextGen Academy is a free online learning platform built in Kigali. You study at your own pace, take an
          assessment, and if you pass, you receive a certificate.
        </p>
        <p>
          A certificate is only useful if people believe it. Every one we issue has a unique code. Anyone, including an
          employer or a university admissions team, can enter that code on our Verify page and see the holder, the
          course and whether it@@U2019@@s still valid.
        </p>
        <p>
          We@@U2019@@re starting with free certificates, and we@@U2019@@re building the platform in the open: courses, assessments and
          verification first, then more from there.
        </p>
      </div>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/register">Create account</ButtonLink>
        <ButtonLink href="/verify" variant="secondary">
          Verify a certificate
        </ButtonLink>
      </div>
    </main>
  );
}

'@

W 'frontend/src/app/(public)/courses/page.tsx' @'
import type { Metadata } from "next";
import Link from "next/link";
import CourseCard, { CoursesUnavailable } from "@/components/site/CourseCard";
import { getCourses } from "@/lib/api/courses";

export const metadata: Metadata = { title: "Courses" };

export default async function CoursesPage() {
  const { data: courses, error } = await getCourses();

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <h1 className="text-4xl font-bold sm:text-5xl">Courses</h1>
      <p className="mt-3 max-w-xl text-ink-soft">
        Every course is free. Pass the final assessment to earn a certificate.
      </p>

      <div className="mt-10">
        {error ? (
          <CoursesUnavailable />
        ) : courses.length === 0 ? (
          <div className="rounded-[14px] border border-rule bg-surface p-8">
            <p className="font-display text-xl font-semibold">No courses are published yet.</p>
            <p className="mt-2 text-ink-soft">
              Create an account now and you@@U2019@@ll be ready to enroll when the first course opens.
            </p>
            <Link href="/register" className="mt-4 inline-block font-semibold text-spine-blue hover:text-blue-deep">
              Create account
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c, i) => (
              <CourseCard key={c.id} course={c} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

'@

W 'frontend/src/app/(public)/page.tsx' @'
import { ButtonLink } from "@/components/ui/Button";
import CourseCard, { CoursesUnavailable } from "@/components/site/CourseCard";
import VerifyForm from "@/components/site/VerifyForm";
import { getCourses } from "@/lib/api/courses";
import Link from "next/link";

// The hero@@U2019@@s memorable element: the logo@@U2019@@s three books, each one a step of the journey.
const spines = [
  { label: "Learn", note: "Self-paced lessons, free.", bg: "bg-spine-green", w: "w-[88%]", shift: "ml-0" },
  { label: "Pass", note: "Take the assessment when you@@U2019@@re ready.", bg: "bg-spine-red", w: "w-full", shift: "sm:-ml-3" },
  { label: "Share", note: "Send a certificate anyone can verify.", bg: "bg-spine-blue", w: "w-[82%]", shift: "sm:ml-2" },
];

export default async function Home() {
  const { data: courses, error } = await getCourses();
  const featured = courses?.slice(0, 3) ?? [];

  return (
    <main>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div>
          <h1 className="text-5xl font-extrabold sm:text-6xl">
            Learn for free. Earn a certificate anyone can check.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-soft">
            Finish a course, pass the assessment, and get a certificate with a code. Employers and universities
            confirm it in seconds, no email chains needed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/register">Create account</ButtonLink>
            <ButtonLink href="/courses" variant="secondary">
              Browse courses
            </ButtonLink>
          </div>
        </div>

        <div className="space-y-3" aria-label="How it works: learn, pass, share">
          {spines.map((s, i) => (
            <div
              key={s.label}
              className={`spine-in ${s.bg} ${s.w} ${s.shift} rounded-xl px-6 py-5 text-white shadow-[0_2px_0_rgba(0,0,0,0.18)]`}
              style={{ animationDelay: `${0.1 + i * 0.14}s` }}
            >
              <p className="font-display text-3xl font-bold">{s.label}</p>
              <p className="mt-0.5 text-[15px] text-white/90">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-3xl font-bold">Start with a course</h2>
          <Link href="/courses" className="text-[15px] font-semibold text-spine-blue hover:text-blue-deep">
            See all courses
          </Link>
        </div>
        <div className="mt-6">
          {error ? (
            <CoursesUnavailable />
          ) : featured.length === 0 ? (
            <p className="rounded-[14px] border border-rule bg-surface p-6 text-ink-soft">
              The first courses are on their way. Create an account and we@@U2019@@ll show them here as soon as they open.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {featured.map((c, i) => (
                <CourseCard key={c.id} course={c} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-[18px] bg-ink px-6 py-10 text-white sm:px-12">
          <h2 className="max-w-xl text-3xl font-bold">Checking someone@@U2019@@s certificate?</h2>
          <p className="mt-3 max-w-xl text-white/70">
            Enter the code on the certificate. You@@U2019@@ll see the holder@@U2019@@s name, the course, and whether it@@U2019@@s still valid.
          </p>
          <div className="mt-6 max-w-2xl">
            <VerifyForm onDark />
          </div>
        </div>
      </section>
    </main>
  );
}

'@

W 'frontend/src/app/(staff)/staff/[section]/page.tsx' @'
"use client";
import { useParams } from "next/navigation";
import StaffCourses from "@/components/staff/StaffCourses";
import { useStaff } from "@/components/staff/StaffShell";

// Sections that already show real data. Every other section lists what is planned.
const COURSE_VIEWS: Record<string, { intro: string; status?: "draft" | "published"; empty: string }> = {
  courses: {
    intro: "Every course on the platform, drafts included.",
    empty: "No courses yet. Run the demo seed or add a course in the admin.",
  },
  "my-courses": {
    intro: "The courses you created.",
    empty: "You haven't created a course yet.",
  },
  queue: {
    intro: "Draft courses waiting for a review.",
    status: "draft",
    empty: "No courses are waiting for review.",
  },
};

export default function SectionPage() {
  const { section } = useParams<{ section: string }>();
  const d = useStaff();
  const current = d.sections.find((s) => s.key === section);

  if (!current) {
    return (
      <div>
        <h1 className="text-3xl font-bold">That page isn&rsquo;t part of your role.</h1>
        <p className="mt-2 text-ink-soft">Use the menu to open one of your sections.</p>
      </div>
    );
  }

  const view = COURSE_VIEWS[current.key];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{current.label}</h1>
        {view && <p className="mt-2 text-ink-soft">{view.intro}</p>}
      </div>

      {view && <StaffCourses status={view.status} showInstructor={d.role !== "instructor"} empty={view.empty} />}

      <section>
        <h2 className="text-2xl font-bold">{view ? "Planned for this section" : "Planned features"}</h2>
        <p className="mt-1 text-[15px] text-ink-soft">These are not built yet. They will appear here as they are added.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {current.items.map((item) => (
            <li key={item} className="flex items-start justify-between gap-3 rounded-[14px] border border-rule bg-surface p-4">
              <span className="text-[15px]">{item}</span>
              <span className="shrink-0 rounded-full bg-ink/[0.07] px-2.5 py-0.5 text-sm text-ink-soft">Planned</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

'@

W 'frontend/src/app/(staff)/staff/activity/page.tsx' @'
"use client";
import { useEffect, useState } from "react";
import { staffApi } from "@/lib/staff/api";

interface Entry { action: string; detail: string; at: string; ip: string | null }

export default function ActivityPage() {
  const [rows, setRows] = useState<Entry[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    staffApi<Entry[]>("/staff/activity/").then(setRows).catch(() => setFailed(true));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">My activity log</h1>
        <p className="mt-2 text-ink-soft">The most recent actions recorded on your account.</p>
      </div>

      {failed ? (
        <p role="alert" className="rounded-[14px] border border-rule bg-surface p-5 text-ink-soft">
          The activity log isn&rsquo;t loading right now. Refresh the page to try again.
        </p>
      ) : rows === null ? (
        <p className="text-muted" role="status">Loading&hellip;</p>
      ) : rows.length === 0 ? (
        <p className="rounded-[14px] border border-rule bg-surface p-5 text-ink-soft">
          Nothing recorded yet. Your actions will show up here.
        </p>
      ) : (
        <ul className="divide-y divide-rule rounded-[14px] border border-rule bg-surface">
          {rows.map((r, i) => (
            <li key={i} className="px-5 py-3.5 text-[15px]">
              <p>
                <span className="font-medium">{r.action}</span>
                {r.detail && <span className="text-ink-soft">: {r.detail}</span>}
              </p>
              <p className="mt-0.5 text-sm text-muted">
                {new Date(r.at).toLocaleString()}
                {r.ip && `, from ${r.ip}`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

'@

W 'frontend/src/app/(staff)/staff/page.tsx' @'
"use client";
import Link from "next/link";
import KpiCard from "@/components/staff/KpiCard";
import StaffCourses from "@/components/staff/StaffCourses";
import TodayPanel from "@/components/staff/TodayPanel";
import { useStaff } from "@/components/staff/StaffShell";

// Roles whose dashboard shows courses, and the section that lists them all.
const COURSE_SECTION: Record<string, string> = {
  super_admin: "courses",
  instructor: "my-courses",
  reviewer: "queue",
};

export default function StaffOverview() {
  const d = useStaff();
  const firstName = (d.user.name || d.user.email).split(" ")[0];
  const courseSection = COURSE_SECTION[d.role];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Welcome, {firstName}</h1>
        <p className="mt-2 text-ink-soft">{d.role_title}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {d.kpis.map((k) => (
          <KpiCard key={k.key} label={k.label} value={k.value} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TodayPanel items={d.today} />
        <section className="rounded-[14px] border border-rule bg-surface p-5">
          <h2 className="text-xl font-bold">Your session</h2>
          <p className="mt-3 text-[15px] text-ink-soft">
            Last login: {d.session.last_login ? new Date(d.session.last_login).toLocaleString() : "not recorded"}
          </p>
          <Link href="/staff/activity" className="mt-3 inline-block text-[15px] font-semibold text-spine-blue hover:text-blue-deep">
            See your activity log
          </Link>
        </section>
      </div>

      {courseSection && (
        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold">Recent courses</h2>
            <Link href={`/staff/${courseSection}`} className="text-[15px] font-semibold text-spine-blue hover:text-blue-deep">
              See all
            </Link>
          </div>
          <StaffCourses limit={5} showInstructor={d.role !== "instructor"} />
        </section>
      )}
    </div>
  );
}

'@

W 'frontend/src/app/staff-login/[role]/page.tsx' @'
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import StaffLoginForm from "@/components/staff/StaffLoginForm";
import { STAFF_ROLES, roleBySlug } from "@/lib/staff/roles";

type Props = { params: Promise<{ role: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => STAFF_ROLES.map((r) => ({ role: r.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { role } = await params;
  const info = roleBySlug(role);
  return { title: info ? `${info.title} sign in` : "Staff sign in" };
}

export default async function StaffRoleLogin({ params }: Props) {
  const { role } = await params;
  const info = roleBySlug(role);
  if (!info) notFound();

  return (
    <AuthShell
      title={`${info.title} sign in`}
      subtitle={info.summary}
      panelTitle={info.panelTitle}
      panelText={info.panelText}
      footer={
        <>
          Not a {info.title.toLowerCase()}?{" "}
          <Link href="/staff-login" className="font-semibold text-spine-blue hover:text-blue-deep">
            Choose another role
          </Link>
        </>
      }
    >
      <StaffLoginForm role={info} />
    </AuthShell>
  );
}

'@

W 'frontend/src/app/staff-login/page.tsx' @'
import type { Metadata } from "next";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import { STAFF_ROLES } from "@/lib/staff/roles";

export const metadata: Metadata = { title: "Staff sign in" };

export default function StaffLoginHub() {
  return (
    <AuthShell
      title="Staff sign in"
      subtitle="Choose your role to continue."
      panelTitle="Run the academy."
      panelText="Each role sees only the tools it needs."
      footer={
        <>
          Are you a learner?{" "}
          <Link href="/login" className="font-semibold text-spine-blue hover:text-blue-deep">
            Log in here
          </Link>
        </>
      }
    >
      <ul className="space-y-3">
        {STAFF_ROLES.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/staff-login/${r.slug}`}
              className="block rounded-[14px] border border-rule bg-surface px-5 py-4 transition-colors hover:border-ink"
            >
              <span className="font-display text-lg font-semibold">{r.title}</span>
              <span className="mt-0.5 block text-[15px] text-ink-soft">{r.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </AuthShell>
  );
}

'@

W 'frontend/src/components/site/SiteFooter.tsx' @'
import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-white/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo dark />
          <p className="mt-4 max-w-sm text-[15px] text-white/65">
            Free courses and certificates that employers and universities can check in seconds.
          </p>
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-white">Learn</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><Link className="hover:text-white" href="/courses">Browse courses</Link></li>
            <li><Link className="hover:text-white" href="/register">Create account</Link></li>
            <li><Link className="hover:text-white" href="/login">Log in</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="font-display text-base font-semibold text-white">Trust</h2>
          <ul className="mt-3 space-y-2 text-[15px]">
            <li><Link className="hover:text-white" href="/verify">Verify a certificate</Link></li>
            <li><Link className="hover:text-white" href="/about">About NextGen Academy</Link></li>
            <li><Link className="hover:text-white" href="/staff-login">Staff sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/50">
        @@U00A9@@ {new Date().getFullYear()} NextGen Academy. Kigali, Rwanda.
      </div>
    </footer>
  );
}

'@

W 'frontend/src/components/site/SiteHeader.tsx' @'
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthProvider";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/verify", label: "Verify a certificate" },
  { href: "/about", label: "About" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { status } = useAuth();

  return (
    <header className="border-b border-rule bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
        <Logo />
        <nav aria-label="Main" className="ml-4 hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-1.5 text-[15px] font-medium ${
                  active ? "bg-ink/[0.06] text-ink" : "text-ink-soft hover:text-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {status === "authed" ? (
            <ButtonLink href="/dashboard">Dashboard</ButtonLink>
          ) : (
            <>
              <span className="hidden sm:inline-flex">
                <ButtonLink href="/login" variant="ghost">
                  Log in
                </ButtonLink>
              </span>
              <ButtonLink href="/register">
                <span className="sm:hidden">Sign up</span>
                <span className="hidden sm:inline">Create account</span>
              </ButtonLink>
            </>
          )}
        </div>
      </div>
      {/* Mobile nav: simple row, no JS needed */}
      <nav aria-label="Main mobile" className="flex gap-1 overflow-x-auto border-t border-rule px-4 py-2 md:hidden">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium text-ink-soft">
            {l.label}
          </Link>
        ))}
        {status !== "authed" && (
          <Link href="/login" className="ml-auto whitespace-nowrap rounded-md px-3 py-1 text-sm font-semibold text-spine-blue">
            Log in
          </Link>
        )}
      </nav>
    </header>
  );
}

'@

W 'frontend/src/components/staff/KpiCard.tsx' @'
export default function KpiCard({ label, value }: { label: string; value: number | null }) {
  const tracked = value !== null && value !== undefined;
  return (
    <div className="rounded-[14px] border border-rule bg-surface p-5">
      <p className="text-[15px] text-ink-soft">{label}</p>
      <p className={`mt-2 font-display text-4xl font-bold ${tracked ? "" : "text-muted"}`}>{tracked ? value : "@@U2013@@"}</p>
      {!tracked && <p className="mt-1 text-sm text-muted">Not tracked yet</p>}
    </div>
  );
}

'@

W 'frontend/src/components/staff/StaffCourses.tsx' @'
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { staffApi } from "@/lib/staff/api";
import type { StaffCourse } from "@/types/staff";

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function StatusChip({ status }: { status: StaffCourse["status"] }) {
  return status === "published" ? (
    <span className="rounded-full bg-spine-green/10 px-2.5 py-0.5 text-sm font-medium text-green-deep">Published</span>
  ) : (
    <span className="rounded-full bg-ink/[0.07] px-2.5 py-0.5 text-sm font-medium text-ink-soft">Draft</span>
  );
}

/** Course list for staff, fetched from the backend. `status` filters; `limit` shortens it for overview panels. */
export default function StaffCourses({
  status,
  limit,
  showInstructor = true,
  empty = "There are no courses here yet.",
}: {
  status?: "draft" | "published";
  limit?: number;
  showInstructor?: boolean;
  empty?: string;
}) {
  const [rows, setRows] = useState<StaffCourse[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    staffApi<StaffCourse[]>(`/staff/courses/${status ? `?status=${status}` : ""}`)
      .then(setRows)
      .catch(() => setFailed(true));
  }, [status]);

  if (failed) {
    return (
      <div role="alert" className="rounded-[14px] border border-rule bg-surface p-5 text-ink-soft">
        <p className="font-semibold text-ink">Courses aren&rsquo;t loading right now.</p>
        <p className="mt-1">Refresh the page. If it keeps happening, check that the backend is running.</p>
      </div>
    );
  }
  if (!rows) return <p className="text-muted" role="status">Loading courses&hellip;</p>;
  if (rows.length === 0) {
    return <p className="rounded-[14px] border border-rule bg-surface p-5 text-ink-soft">{empty}</p>;
  }

  const shown = limit ? rows.slice(0, limit) : rows;
  return (
    <div className="overflow-x-auto rounded-[14px] border border-rule bg-surface">
      <table className="w-full min-w-[640px] text-left text-[15px]">
        <thead className="border-b border-rule text-sm text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Course</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {showInstructor && <th className="px-4 py-3 font-medium">Instructor</th>}
            <th className="px-4 py-3 font-medium">Content</th>
            <th className="px-4 py-3 font-medium">Learners</th>
            <th className="px-4 py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-rule">
          {shown.map((c) => (
            <tr key={c.id}>
              <td className="px-4 py-3">
                <p className="font-medium">{c.title}</p>
                <p className="text-sm capitalize text-muted">
                  {c.level}, {c.estimated_hours} hours
                  {c.status === "published" && (
                    <>
                      {" "}
                      <Link href={`/courses/${c.slug}`} className="font-medium normal-case text-spine-blue hover:text-blue-deep">
                        View page
                      </Link>
                    </>
                  )}
                </p>
              </td>
              <td className="px-4 py-3"><StatusChip status={c.status} /></td>
              {showInstructor && <td className="px-4 py-3 text-ink-soft">{c.instructor ?? "Not assigned"}</td>}
              <td className="px-4 py-3 text-ink-soft">
                {c.modules} {c.modules === 1 ? "module" : "modules"}, {c.lessons} {c.lessons === 1 ? "lesson" : "lessons"}
              </td>
              <td className="px-4 py-3 text-ink-soft">
                {c.learners} enrolled{c.learners > 0 && `, ${c.completed} finished`}
              </td>
              <td className="px-4 py-3 text-ink-soft">{date(c.updated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

'@

W 'frontend/src/components/staff/StaffLoginForm.tsx' @'
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import Field, { FormAlert } from "@/components/ui/Field";
import { staffLogin } from "@/lib/staff/api";
import type { StaffRoleInfo } from "@/lib/staff/roles";

export default function StaffLoginForm({ role }: { role: StaffRoleInfo }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your work email and password.");
      return;
    }
    setLoading(true);
    try {
      await staffLogin(email.trim(), password, role.role);
      router.push("/staff");
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5" noValidate>
      {error && <FormAlert>{error}</FormAlert>}
      <Field
        label="Work email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Field
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" loading={loading} className="w-full">
        Sign in
      </Button>
      {process.env.NODE_ENV === "development" && (
        <p className="text-sm text-muted">
          Local demo account: {role.slug}@nextgen.test. The password is in the README.
        </p>
      )}
    </form>
  );
}

'@

W 'frontend/src/components/staff/StaffShell.tsx' @'
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import { clearToken, getToken, staffApi } from "@/lib/staff/api";
import type { StaffDashboard } from "@/types/staff";

const StaffContext = createContext<StaffDashboard | null>(null);
export const useStaff = () => {
  const ctx = useContext(StaffContext);
  if (!ctx) throw new Error("useStaff must be used inside StaffShell");
  return ctx;
};

export default function StaffShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<StaffDashboard | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getToken()) {
      router.replace("/staff-login");
      return;
    }
    staffApi<StaffDashboard>("/staff/dashboard/")
      .then(setData)
      .catch((e: Error) => {
        if (e.message === "unauthorized") {
          clearToken();
          router.replace("/staff-login");
        } else setError(e.message);
      });
  }, [router]);

  if (error) {
    return (
      <div className="grid min-h-screen place-items-center px-5">
        <div role="alert" className="max-w-md rounded-[14px] border border-rule bg-surface p-6">
          <p className="font-display text-xl font-semibold">The dashboard isn&rsquo;t loading.</p>
          <p className="mt-1 text-ink-soft">{error}</p>
          <button onClick={() => location.reload()} className="mt-4 font-semibold text-spine-blue hover:text-blue-deep">
            Try again
          </button>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="grid min-h-screen place-items-center text-muted" role="status">
        Loading your dashboard&hellip;
      </div>
    );
  }

  const logout = () => {
    clearToken();
    router.replace("/staff-login");
  };
  const href = (key: string) => (key === "overview" ? "/staff" : `/staff/${key}`);
  const links = [
    ...data.sections.map((s) => ({ href: href(s.key), label: s.label })),
    { href: "/staff/activity", label: "My activity log" },
  ];
  const isActive = (h: string) => pathname === h;

  return (
    <StaffContext.Provider value={data}>
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center gap-4 border-b border-rule bg-surface px-5 py-3">
          <Logo href="/staff" />
          <span className="hidden rounded-md bg-ink/[0.06] px-2 py-0.5 text-sm font-medium text-ink-soft sm:inline">
            Staff
          </span>
          <details className="relative ml-auto">
            <summary className="cursor-pointer list-none rounded-lg border border-rule px-3.5 py-2 text-[15px] font-medium hover:border-ink">
              {data.user.name || data.user.email}
            </summary>
            <div className="absolute right-0 z-10 mt-2 w-72 rounded-[14px] border border-rule bg-surface p-4 text-[15px] shadow-[0_8px_24px_rgba(18,21,28,0.12)]">
              <p className="font-display text-lg font-semibold">{data.user.name}</p>
              <p className="text-ink-soft">{data.role_title}</p>
              <p className="mt-1 break-all text-sm text-muted">{data.user.email}</p>
              <p className="mt-3 text-sm text-muted">
                Last login:{" "}
                {data.session.last_login ? new Date(data.session.last_login).toLocaleString() : "not recorded"}
              </p>
              <button
                onClick={logout}
                className="mt-4 w-full rounded-lg bg-ink px-3 py-2 font-semibold text-white hover:bg-ink-soft"
              >
                Log out
              </button>
            </div>
          </details>
        </header>

        {/* Small screens: a scrollable row instead of the sidebar */}
        <nav aria-label="Staff mobile" className="flex gap-1 overflow-x-auto border-b border-rule bg-surface px-3 py-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l.href) ? "page" : undefined}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ${
                isActive(l.href) ? "bg-ink text-white" : "text-ink-soft"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1">
          <nav aria-label="Staff" className="hidden w-64 shrink-0 bg-ink px-3 py-6 text-[15px] text-white/75 lg:block">
            <p className="mb-3 px-3 font-display text-base font-semibold text-white">{data.role_title}</p>
            <ul className="space-y-0.5">
              {links.map((l, i) => (
                <li key={l.href} className={i === links.length - 1 ? "mt-4 border-t border-white/10 pt-4" : ""}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className={`block rounded-md border-l-[3px] px-3 py-2 ${
                      isActive(l.href)
                        ? "border-spine-green bg-white/10 font-medium text-white"
                        : "border-transparent hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
            <div className="mx-auto max-w-5xl">{children}</div>
          </main>
        </div>
      </div>
    </StaffContext.Provider>
  );
}

'@

W 'frontend/src/components/staff/TodayPanel.tsx' @'
import type { TodayItem } from "@/types/staff";

export default function TodayPanel({ items }: { items: TodayItem[] }) {
  return (
    <section className="rounded-[14px] border border-rule bg-surface p-5">
      <h2 className="text-xl font-bold">Needs your attention</h2>
      {items.length === 0 ? (
        <p className="mt-3 text-[15px] text-ink-soft">Nothing needs your attention right now.</p>
      ) : (
        <ul className="mt-3 divide-y divide-rule text-[15px]">
          {items.map((i) => (
            <li key={i.label} className="flex items-center justify-between gap-4 py-2.5">
              <span>{i.label}</span>
              <span className="min-w-8 rounded-full bg-spine-blue/10 px-2.5 py-0.5 text-center font-semibold text-blue-deep">
                {i.count}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

'@

W 'frontend/src/lib/staff/api.ts' @'
import type { StaffDashboard } from "@/types/staff";
import { roleByKey } from "./roles";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
const ACCESS = "staff_access";
const REFRESH = "staff_refresh";

// Phase 1 simplicity: tokens in localStorage. Move to httpOnly cookies before going public.
const browser = () => typeof window !== "undefined";
export const getToken = () => (browser() ? localStorage.getItem(ACCESS) : null);
const getRefresh = () => (browser() ? localStorage.getItem(REFRESH) : null);

export function clearToken() {
  if (!browser()) return;
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}

const NETWORK = "We can't reach the server. Check your connection and try again.";

async function post(path: string, body: unknown): Promise<Response> {
  try {
    return await fetch(`${API}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(NETWORK);
  }
}

async function refreshAccess(): Promise<boolean> {
  const refresh = getRefresh();
  if (!refresh) return false;
  try {
    const res = await post("/auth/refresh/", { refresh });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem(ACCESS, data.access);
    if (data.refresh) localStorage.setItem(REFRESH, data.refresh);
    return true;
  } catch {
    return false;
  }
}

/** GET with the staff token. Refreshes it once when it has expired. Throws Error("unauthorized") if the session is over. */
export async function staffApi<T>(path: string): Promise<T> {
  const run = () =>
    fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${getToken()}` }, cache: "no-store" });

  let res: Response;
  try {
    res = await run();
    if (res.status === 401 && (await refreshAccess())) res = await run();
  } catch {
    throw new Error(NETWORK);
  }
  if (res.status === 401 || res.status === 403) throw new Error("unauthorized");
  if (!res.ok) throw new Error(`Something went wrong (error ${res.status}). Try again.`);
  return res.json() as Promise<T>;
}

/**
 * Signs in, then checks the account really is staff. When `expectedRole` is given (a role-specific sign-in page),
 * an account with a different role is turned away with a message that says which page to use.
 */
export async function staffLogin(email: string, password: string, expectedRole?: string): Promise<StaffDashboard> {
  const res = await post("/auth/login/", { email, password });
  if (res.status === 400 || res.status === 401) {
    throw new Error("That email and password don't match. Check them and try again.");
  }
  if (!res.ok) throw new Error("Sign-in failed. Try again in a moment.");
  const tokens = await res.json();
  localStorage.setItem(ACCESS, tokens.access);
  if (tokens.refresh) localStorage.setItem(REFRESH, tokens.refresh);

  let dash: StaffDashboard;
  try {
    dash = await staffApi<StaffDashboard>("/staff/dashboard/");
  } catch (err) {
    clearToken();
    if ((err as Error).message === "unauthorized") {
      throw new Error("This account doesn't have staff access. If you're a learner, use the learner log in instead.");
    }
    throw err;
  }

  if (expectedRole && dash.role !== expectedRole) {
    clearToken();
    const actual = roleByKey(dash.role);
    throw new Error(
      `This is ${/^[aeiou]/i.test(actual?.title ?? dash.role_title) ? "an" : "a"} ${(actual?.title ?? dash.role_title).toLowerCase()} account. Use the ${(actual?.title ?? "right").toLowerCase()} sign-in instead.`,
    );
  }
  return dash;
}

'@

W 'frontend/src/lib/staff/roles.ts' @'
/** The five staff roles. `role` matches the backend key; `slug` is the URL used for that role's sign-in page. */
export interface StaffRoleInfo {
  role: string;
  slug: string;
  title: string;
  summary: string;
  panelTitle: string;
  panelText: string;
}

export const STAFF_ROLES: StaffRoleInfo[] = [
  {
    role: "super_admin",
    slug: "admin",
    title: "Super admin",
    summary: "Platform owner. Manage users, staff, courses, settings and the audit log.",
    panelTitle: "Run the academy.",
    panelText: "Every action you take here is recorded in the audit log.",
  },
  {
    role: "instructor",
    slug: "instructor",
    title: "Instructor",
    summary: "Create and manage your courses, quizzes and learners.",
    panelTitle: "Teach the next generation.",
    panelText: "Build courses, see how learners are doing and answer their questions.",
  },
  {
    role: "reviewer",
    slug: "reviewer",
    title: "Content reviewer",
    summary: "Check new and updated courses before they go live.",
    panelTitle: "Keep quality high.",
    panelText: "Review courses against the standards and send clear feedback to instructors.",
  },
  {
    role: "moderator",
    slug: "moderator",
    title: "Community moderator",
    summary: "Keep discussions helpful and respectful.",
    panelTitle: "Keep the community kind.",
    panelText: "Handle flagged posts and reports, and keep a record of every decision.",
  },
  {
    role: "support",
    slug: "support",
    title: "Support agent",
    summary: "Help learners with accounts, access and certificates.",
    panelTitle: "Help learners get unstuck.",
    panelText: "Answer tickets quickly and fix access problems for learners.",
  },
];

export const roleBySlug = (slug: string) => STAFF_ROLES.find((r) => r.slug === slug);
export const roleByKey = (role: string) => STAFF_ROLES.find((r) => r.role === role);

'@

W 'frontend/src/types/staff.ts' @'
export interface NavSection { key: string; label: string; items: string[] }
export interface Kpi { key: string; label: string; value: number | null }
export interface TodayItem { label: string; count: number }
export interface StaffDashboard {
  role: string;
  role_title: string;
  user: { name: string; email: string };
  session: { last_login: string | null };
  kpis: Kpi[];
  today: TodayItem[];
  sections: NavSection[];
}

export interface StaffCourse {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published";
  level: string;
  estimated_hours: number;
  modules: number;
  lessons: number;
  learners: number;
  completed: number;
  instructor: string | null;
  updated_at: string;
}

'@

Write-Host 'Files written. Next: cd backend; python manage.py makemigrations accounts common academics learning assessments certificates staff; python manage.py migrate; python manage.py seed_demo'