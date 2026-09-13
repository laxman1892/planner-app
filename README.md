# PlanQuest: Gamified Productivity Growth System

PlanQuest is a fullstack portfolio app built around event quests, challenges, progression, and collaboration. The current implementation now includes the renewed auth flow, dashboard command center, dedicated challenge creation route, profile progression surface, invitation-driven collaboration, and the first notification/reminder slice.

## Tech Stack

- Backend: Django, Django REST Framework, SimpleJWT
- Frontend: Next.js, React
- Database: SQLite for development, PostgreSQL-ready settings later
- Auth: Email-based custom user model with JWT
- Media: Local profile picture uploads during development

## Current Renewal Scope

- Register and log in with JWT auth
- Use the renewed two-panel login and register experience
- Retrieve and update the authenticated user profile through the backend API
- Create, edit, complete, list, and delete event quests
- Invite collaborators into event quests and manage invitation response flow
- Create your own challenges from a dedicated challenge route, log progress, and complete them
- Earn and list achievement badges tied to challenge activity
- View dashboard command-center summaries for focus, XP, and deadlines
- View in-app notifications
- Store notification preferences
- View profile progression summary and lightweight squad members
- Generate email and in-app reminders

## Current Product Posture

PlanQuest should currently be described as a gamified productivity growth system with planner and collaboration support.

- Core loop: manage event quests, keep challenge momentum alive, and respond to reminders and collaboration signals.
- Supporting systems: achievements, progression, and notifications.
- Deferred from product claims: OAuth, full social graph behavior, collaborative challenges as a polished user-facing feature, broad live XP economy wiring, and real-time systems.

## Project Structure

```text
backend/
  apps/
    accounts/
    planner/
    challenges/
    achievements/
    notifications/
    progression/
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
- `GET|POST /api/event-invitations/`
- `GET|POST /api/challenges/`
- `POST /api/challenges/{id}/complete/`
- `GET|POST /api/progress/`
- `GET /api/achievements/`
- `GET /api/progression/me/`
- `GET|PATCH /api/notifications/`
- `GET|PATCH /api/notification-preferences/me/`

`/api/event-participants/` and `/api/event-invitations/` support invitation preview and response flow. Notifications and reminders now sit beside that invitation flow as the first retention and collaboration system.

## Architecture Notes

- Product direction: [docs/architecture/planquest-product-direction.md](/C:/Users/laxman/Documents/planner-app/docs/architecture/planquest-product-direction.md)
- User journeys: [docs/architecture/planquest-user-journeys.md](/C:/Users/laxman/Documents/planner-app/docs/architecture/planquest-user-journeys.md)
- Domain rules: [docs/architecture/planquest-domain-rules.md](/C:/Users/laxman/Documents/planner-app/docs/architecture/planquest-domain-rules.md)
- Notifications and reminders: [docs/architecture/notifications-and-reminders.md](/C:/Users/laxman/Documents/planner-app/docs/architecture/notifications-and-reminders.md)
- Progression and reward rules: [docs/architecture/progression-and-reward-rules.md](/C:/Users/laxman/Documents/planner-app/docs/architecture/progression-and-reward-rules.md)
- Renewal status report: [docs/architecture/gamified-renewal-status-report.md](/C:/Users/laxman/Documents/planner-app/docs/architecture/gamified-renewal-status-report.md)

## Notification Jobs

Run this locally to generate due reminders and send pending emails:

```bash
cd backend
.venv\Scripts\python.exe manage.py run_notification_jobs
```

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
