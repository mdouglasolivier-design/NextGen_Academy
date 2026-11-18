# University Platform (Phase 1: Free Certificates)

Stack: Django + DRF (backend) · Next.js + TypeScript (frontend) · PostgreSQL

## Run the backend
    cd backend
    python -m venv .venv
    source .venv/bin/activate        # Windows: .venv\Scripts\activate
    pip install -r requirements/dev.txt
    cp .env.example .env
    python manage.py makemigrations accounts common academics learning assessments certificates
    python manage.py migrate
    python manage.py createsuperuser
    python manage.py runserver

Admin: http://localhost:8000/admin/   API docs: http://localhost:8000/api/docs/

## Run the frontend
    cd frontend
    npm install
    npm run dev

Frontend: http://localhost:3000
