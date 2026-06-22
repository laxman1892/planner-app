# Project Brief

## Product Idea

PlanQuest is a planner-first collaborative accountability app. Users organize upcoming plans, track personal challenge progress, and earn achievements, while shared planning is the primary product direction that still needs fuller implementation across backend rules and frontend flows.

## Primary Portfolio Goals

- Show a custom Django user model using email login.
- Demonstrate DRF viewsets, serializers, permissions, and JWT auth.
- Model real relationships: creators, participants, invitations, progress logs, and achievements.
- Build a React frontend with practical app screens rather than a marketing page.
- Keep the codebase organized enough to grow from personal planning into a believable shared-planning product.

## MVP User Stories

- As a user, I can register with email, username, name, and password.
- As a user, I can log in and receive JWT access and refresh tokens.
- As a user, I can create events with date, time, category, and description.
- As a user, I can update or delete my own events.
- As a user, I can create a challenge for myself.
- As a user, I can add progress notes to a challenge.
- As a user, I can earn and view badges on my profile.

## Deferred From MVP Positioning

- End-to-end event invitation workflows surfaced in the frontend.
- Shared event visibility for invited and accepted participants.
- Group challenges presented as a finished user-facing feature.
- Social graph, notifications, leaderboards, and real-time updates.

## Near-Term V1 Direction

- Turn collaborative event planning into the first polished multi-user slice.
- Make invitation ownership and visibility rules explicit.
- Expose more of the existing profile API in the frontend.
- Keep challenges and achievements as supporting accountability systems around the planning loop.

## Stretch Ideas

- Notifications for invites, challenges, and achievements.
- Leaderboards for completed challenges and streaks.
- Maps API integration for event locations.
- WebSocket updates for social activity.
- PostgreSQL deployment with cloud media storage.
