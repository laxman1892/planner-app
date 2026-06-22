# PlanQuest Product Direction

## Product Identity

PlanQuest is a planner-first collaborative accountability app.

In Phase 1, the product should be described as a personal planning and accountability experience that is being shaped toward shared planning. The strongest implemented loop today is: authenticate, manage your own events, manage your own challenges, log progress, and earn achievements. Collaboration exists in the data model and product direction, but not yet as a complete end-to-end experience.

## Core Promise

PlanQuest gives users one place to organize upcoming commitments and stay accountable through lightweight challenge tracking and achievements, with shared planning as the next collaboration layer rather than a fully finished behavior today.

Weekly return reason:

> Users come back each week to review upcoming plans, adjust their schedule, and keep their personal accountability streak alive.

## Personas

### Primary Persona

`Planner-led accountability user`

- Wants a simple system for organizing upcoming events and keeping momentum on personal goals.
- Values one dashboard that combines schedule awareness with visible progress.
- May eventually invite other people into plans, but can still get value from the product alone today.

### Secondary Persona

`Small-group coordinator`

- Wants to turn an event or commitment into a shared plan with another person or a small group.
- Cares about invitation status and visibility rules.
- Is important to the product direction, but is only partially supported by the current implementation.

## MVP, V1, And Non-Goals

### MVP

Phase 1 MVP should be framed around what the repo can support honestly today, plus the minimum collaboration posture we are designing toward.

- Auth with registration, login, JWT session, and profile retrieval/update API.
- Personal event CRUD owned by the authenticated creator.
- Personal self-challenge CRUD with progress logging.
- Achievement awarding and listing for challenge completion and streak behavior.
- Documentation and rules that position collaborative event planning as the next hardening target.

### V1

These fit the intended product direction, but should not be presented as complete today.

- Event invitation lifecycle with accepted, pending, and declined states surfaced in product flows.
- Event visibility that includes owned events plus invited/accepted participation views.
- Clear participant-facing event UI.
- More deliberate profile editing experience in the frontend.
- A collaboration-first vertical slice that works with at least two users.

### Non-Goals For Phase 1

- Presenting group challenges as production-ready.
- Presenting social graph or friend network behavior as implemented.
- Real-time collaboration, notifications, leaderboards, or live activity feeds.
- Marketing the app as a fully polished multi-user coordination platform before invitation and visibility rules are hardened.

## Capability Inventory

| Capability | Status | Why |
| --- | --- | --- |
| Registration and login | Core | Backend auth flow is implemented and tested; frontend supports register/login. |
| JWT session persistence | Core | Frontend stores access/refresh tokens and reloads session data from local storage. |
| Profile retrieval/update API | Supporting | Backend supports `GET` and `PUT/PATCH` on the current user, but the frontend does not yet expose meaningful profile editing. |
| Personal event creation, editing, deletion | Core | Backend event queryset is creator-only and tested; frontend provides create/edit/delete UI. |
| Collaborative events / shared event viewing | Unclear | `EventParticipant` exists, but `EventViewSet` returns only creator-owned events and the frontend has no invitation flow. |
| Event invitations | Supporting | Participant model, serializer, and viewset exist, but invitation lifecycle is not integrated into the main product experience. |
| Self challenges | Core | Backend challenge flow is creator-only and tested; frontend supports create, log progress, and complete. |
| Group challenges | Unclear | Model includes `participants` and `challenge_type`, but creation is forced to `self`, queryset is creator-only, and no group UI exists. |
| Progress logging | Core | API enforces one log per challenge/day and blocks logs on completed challenges; frontend supports logging. |
| Achievements | Supporting | Badge awarding and listing are implemented and tested, but they support accountability rather than define the primary product loop. |
| Social/friends layer | Unclear | Frontend shows a hard-coded "Friends involved" stat with no backend social system. |

## Success Metrics

Phase 1 metrics should emphasize clarity and believable product scope rather than premature growth metrics.

- A new contributor can explain PlanQuest in under 60 seconds as a planner-first accountability app.
- README, project brief, and architecture docs all describe the same MVP posture.
- Every current feature maps to one of three journeys: onboarding, planner use, or challenge accountability.
- At least one clearly desirable idea is explicitly deferred to protect focus.
- No doc claims that event collaboration or group challenges are fully shipped when the current implementation is still creator-centric.

## Justification From Current Implementation

The planner-first posture is grounded in the codebase as it exists today:

- `backend/apps/planner/views.py` limits event queries to `creator=self.request.user`, which means the live event experience is personal ownership first.
- `backend/apps/challenges/views.py` also limits challenges to the creator and forces newly created challenges to `self`, so group challenge positioning would overstate reality.
- `backend/apps/planner/models.py` and `backend/apps/challenges/models.py` already include collaboration-oriented structures such as event participants and challenge participants, which justifies keeping collaboration in the product direction.
- `frontend/components/auth/AuthExperience.jsx` exposes a working dashboard for personal events, self challenges, progress logging, and achievements, but not invitation acceptance, participant views, or a real group coordination flow.
- Existing backend tests cover auth, personal events, self-challenge behavior, progress permissions, and achievements, reinforcing that the most reliable current slice is personal planning plus accountability.

## Product Posture Decision

Phase 1 is locked as:

> Planner-first collaborative accountability.

That means:

- Shared planning is the intended core loop.
- Personal planning is the most complete implemented behavior today.
- Challenges and achievements remain supporting engagement systems, not the product identity on their own.
