# PlanQuest: Planner-First Collaborative Accountability

PlanQuest is a fullstack portfolio app built around personal planning and lightweight accountability. The current implementation is strongest at auth, personal event management, self-challenge tracking, progress logging, and achievement badges, while collaborative planning remains the intended direction rather than a fully completed product flow today.

## Tech Stack

- Backend: Django, Django REST Framework, SimpleJWT
- Frontend: Next.js, React
- Database: SQLite for development, PostgreSQL-ready settings later
- Auth: Email-based custom user model with JWT
- Media: Local profile picture uploads during development

## Current Phase 1 Scope

- Register and log in with JWT auth
- Retrieve and update the authenticated user profile through the backend API
- Create, edit, list, and delete your own planner events
- Create your own challenges, log progress, and complete them
- Earn and list achievement badges tied to challenge activity

## Current Product Posture

PlanQuest should currently be described as a planner-first collaborative accountability app.

- Core loop: manage upcoming plans and stay accountable through challenge progress.
- Supporting systems: achievements and challenge streaks.
- Deferred from product claims: fully realized shared events, invitation workflows in the frontend, and group challenges as a polished user-facing feature.

## Project Structure

```text
backend/
  apps/
    accounts/
    planner/
    challenges/
    achievements/
  config/
frontend/
  app/
  components/
  lib/
docs/
```

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The Next.js app expects the backend API at `http://localhost:8000/api` by default. Override it with `NEXT_PUBLIC_API_BASE_URL` if needed.

## API Highlights

- `POST /api/auth/register/`
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`
- `GET /api/auth/me/`
- `GET|POST /api/events/`
- `GET|POST /api/event-participants/`
- `GET|POST /api/challenges/`
- `POST /api/challenges/{id}/complete/`
- `GET|POST /api/progress/`
- `GET /api/achievements/`

`/api/event-participants/` exists as backend collaboration scaffolding, but the main event flow is still creator-centric because event listing and editing remain owner-only.

## Architecture Notes

- Product direction: [docs/architecture/planquest-product-direction.md](/C:/Users/laxman/Documents/planner-app/docs/architecture/planquest-product-direction.md)
- User journeys: [docs/architecture/planquest-user-journeys.md](/C:/Users/laxman/Documents/planner-app/docs/architecture/planquest-user-journeys.md)
- Domain rules: [docs/architecture/planquest-domain-rules.md](/C:/Users/laxman/Documents/planner-app/docs/architecture/planquest-domain-rules.md)

## Next Build Step

Harden the collaboration slice so invitation state, shared event visibility, and participant-facing UI are as real as the existing personal planning flows.

## Local Quality Gates

Run these before pushing:

```bash
cd backend
.venv\Scripts\python.exe manage.py test
```

```bash
cd frontend
npm test
npm run lint
npm run build
```

Checklist:

- backend tests must pass
- frontend tests must pass
- frontend lint must pass
- frontend build must pass

Release note:

- Detailed local workflow is in [docs/release/local-dev-checklist.md](/C:/Users/laxman/Documents/planner-app/docs/release/local-dev-checklist.md)
- Pull request review gate is in [docs/release/pull-request-checklist.md](/C:/Users/laxman/Documents/planner-app/docs/release/pull-request-checklist.md)
