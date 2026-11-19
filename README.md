# University Platform (Phase 1: Free Certificates)

Stack: Django + DRF (backend) · Next.js + TypeScript (frontend) · PostgreSQL

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
