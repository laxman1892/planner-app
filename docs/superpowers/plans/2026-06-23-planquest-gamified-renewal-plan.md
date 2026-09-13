# PlanQuest Gamified Renewal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework PlanQuest from the current planner-first MVP into the renewed gamified growth version described in `docs/architecture/planquest-gamified-ui-direction.md`, while preserving the domain split between event quests and challenges.

**Architecture:** Execute this as a controlled renewal, not a big-bang rewrite. Keep the current Django and Next.js repo structure, add missing backend seams for progression, notifications, and richer event/challenge metadata, then reshape the frontend route-by-route: dashboard, planner, challenges, and profile. Notifications and reminders are one first-class workstream inside the broader product renewal, not a separate product plan.

**Tech Stack:** Django 5, Django REST Framework, SimpleJWT, Next.js 15 App Router, React 19, SQLite for local development, Django email backend, Node test runner, ESLint

---

## Scope

This plan covers:

- login and sign-up UI refresh
- renewed dashboard logic and UI
- event quest framing for planner items
- challenge hub and dedicated challenge creation flow
- progression model groundwork
- profile progression surface
- notification center, email notifications, and reminders
- lightweight squad/allies presentation
- updated docs and verification

This plan intentionally does not cover:

- OAuth or real Google/Facebook sign-in
- full friend graph
- DMs or mentions
- RTC
- websocket infrastructure
- group challenge collaboration beyond explicit future seams
- full leaderboard system
- full reward economy balancing

## Product Rules Locked By This Plan

- `Event` becomes `Event Quest` in UI and workflow.
- `Challenge` stays `Challenge`.
- Event quests and challenges both feed progression, but remain separate domain methods.
- Auth screens should match the renewed visual direction.
- Social login buttons are presentation-only in this phase unless backend OAuth work is explicitly added later.
- Planner route owns event quests.
- Challenges route owns challenges.
- Notifications support both collaboration events and reminders.
- Reminder emails and in-app reminders are mandatory work in this renewal.
- Event reminders fire at `24 hours`, `1 hour`, and `5 minutes` before start time.
- Challenge reminders go to the challenge owner only in this phase.

## File Structure Strategy

### Backend

- Create `backend/apps/notifications/`
  - notification records
  - delivery records
  - preferences
  - reminder generation
- Create `backend/apps/progression/`
  - XP rules
  - level thresholds
  - progression summary services
- Modify `backend/apps/planner/models.py`
  - event quest metadata
  - event completion state
- Modify `backend/apps/planner/serializers.py`
  - event quest fields and validation
- Modify `backend/apps/planner/services.py`
  - invitation notifications
  - event reminder hooks
- Modify `backend/apps/planner/views.py`
  - event quest API exposure
- Modify `backend/apps/challenges/models.py`
  - richer challenge metadata
  - streak goal / tags / XP preview fields
- Modify `backend/apps/challenges/serializers.py`
  - challenge creation flow contract
- Modify `backend/apps/challenges/services.py`
  - challenge reminder hooks
  - reward preview helpers if kept backend-side
- Modify `backend/apps/achievements/services.py`
  - progression-aware achievement triggers
- Modify `backend/apps/accounts/models.py`
  - profile-facing settings or metadata only if needed
- Modify `backend/config/settings.py`
  - install new apps
  - email settings
- Modify `backend/config/urls.py`
  - notification/progression routes

### Frontend

- Modify `frontend/app/(auth)/login/page.jsx`
  - renewed login layout
- Modify `frontend/app/(auth)/register/page.jsx`
  - renewed register layout
- Modify `frontend/app/(auth)/layout.jsx`
  - auth-shell presentation if needed
- Modify `frontend/components/auth/LoginForm.jsx`
  - renewed login form behavior
- Modify `frontend/components/auth/RegisterForm.jsx`
  - renewed register form behavior
- Modify `frontend/components/dashboard/DashboardOverviewPage.jsx`
  - command-center layout
- Modify `frontend/components/dashboard/EventsPage.jsx`
  - planner/event quest framing
- Modify `frontend/components/dashboard/ChallengesPage.jsx`
  - challenge hub
- Modify `frontend/components/dashboard/ProfilePage.jsx`
  - profile progression and preferences
- Modify `frontend/components/layout/Sidebar.jsx`
  - renewed navigation labels where appropriate
- Modify `frontend/components/layout/Topbar.jsx`
  - search / notifications / avatar behavior
- Modify `frontend/components/events/EventList.jsx`
  - event quest card semantics
- Modify `frontend/components/events/EventModal.jsx`
  - event quest fields and completion support
- Create `frontend/components/challenges/ChallengeHub.jsx`
  - active challenge grid + right rail
- Create `frontend/components/challenges/ChallengeCreateForm.jsx`
  - dedicated challenge creation UI
- Create `frontend/components/notifications/NotificationBell.jsx`
- Create `frontend/components/notifications/NotificationCenter.jsx`
- Create `frontend/components/notifications/NotificationPreferencesForm.jsx`
- Create `frontend/components/profile/ProfileProgressPanel.jsx`
- Create `frontend/components/profile/SquadPanel.jsx`
- Create `frontend/components/dashboard/DashboardStats.jsx`
- Create `frontend/components/dashboard/FocusCards.jsx`
- Modify `frontend/lib/api.js`
  - progression
  - notifications
  - richer event/challenge endpoints
- Create `frontend/lib/progression.js`
- Create `frontend/lib/progression.test.js`
- Create `frontend/lib/notifications.js`
- Create `frontend/lib/notifications.test.js`

### Docs

- Modify `docs/architecture/planquest-product-direction.md`
- Modify `docs/architecture/planquest-user-journeys.md`
- Modify `docs/architecture/planquest-domain-rules.md`
- Create `docs/architecture/notifications-and-reminders.md`
- Create `docs/architecture/progression-and-reward-rules.md`
- Create `docs/architecture/gamified-renewal-status-report.md`

## Task 1: Align Product Docs To The Renewed Direction

**Files:**
- Modify: `docs/architecture/planquest-product-direction.md`
- Modify: `docs/architecture/planquest-user-journeys.md`
- Modify: `docs/architecture/planquest-domain-rules.md`

- [ ] **Step 1: Replace the old product posture in `planquest-product-direction.md`**

Update the main positioning from:

```md
Planner-first collaborative accountability.
```

to:

```md
Gamified productivity growth system with planner and collaboration support.
```

Keep the document explicit that:

- event quests and challenges are separate
- planner route is event-quest-led
- challenges route is challenge-led
- notifications and reminders are core retention features

- [ ] **Step 2: Rewrite the main user journeys**

Update `docs/architecture/planquest-user-journeys.md` to these journeys:

1. onboarding and progression-aware dashboard
2. planner event quest creation and collaboration
3. challenge creation, logging, and reward loop
4. profile progression and preferences

- [ ] **Step 3: Update domain rules**

Add or revise rules for:

- event quest terminology
- event completion vs deletion
- event reminder windows
- challenge reminder policy
- notification preferences
- progression inputs

- [ ] **Step 4: Review docs for contradictions**

Check that none of the updated files still claim:

- planner-first MVP posture
- personal-only challenge system as the intended future
- no notification system in the renewed direction

- [ ] **Step 5: Commit**

```bash
git add docs/architecture/planquest-product-direction.md docs/architecture/planquest-user-journeys.md docs/architecture/planquest-domain-rules.md
git commit -m "Align architecture docs to gamified renewal"
```

## Task 2: Add Progression Domain Groundwork

**Files:**
- Create: `backend/apps/progression/apps.py`
- Create: `backend/apps/progression/models.py`
- Create: `backend/apps/progression/services.py`
- Create: `backend/apps/progression/serializers.py`
- Create: `backend/apps/progression/views.py`
- Create: `backend/apps/progression/tests/test_progression_rules.py`
- Modify: `backend/config/settings.py`
- Modify: `backend/config/urls.py`

- [ ] **Step 1: Write failing progression rule tests**

Create `backend/apps/progression/tests/test_progression_rules.py` with coverage for:

```python
def test_level_is_derived_from_total_xp(self):
    ...

def test_event_completion_awards_xp(self):
    ...

def test_challenge_completion_awards_xp(self):
    ...

def test_duplicate_reward_event_is_idempotent(self):
    ...
```

- [ ] **Step 2: Run progression tests to verify failure**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.progression.tests.test_progression_rules
```

Expected:

- FAIL because progression app does not exist yet

- [ ] **Step 3: Add the smallest progression model**

Use:

- `ProgressLedger`
  - user
  - source_type
  - source_id
  - action
  - xp_delta
  - created_at

Do not add a separate cached profile stats table yet unless the queries become awkward.

- [ ] **Step 4: Add minimal progression services**

Implement:

- `award_xp(...)`
- `get_total_xp(user)`
- `get_level_for_xp(total_xp)`
- `get_progress_summary(user)`

Keep level rules deterministic and local to one file.

- [ ] **Step 5: Add a read API**

Expose:

- `/api/progression/me/`

returning:

- total XP
- level
- next level XP target
- recent earned XP total if easy to derive

- [ ] **Step 6: Re-run progression tests**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.progression.tests.test_progression_rules
```

Expected:

- PASS

- [ ] **Step 7: Commit**

```bash
git add backend/apps/progression backend/config/settings.py backend/config/urls.py
git commit -m "Add progression domain groundwork"
```

## Task 3: Upgrade Planner Events Into Event Quests

**Files:**
- Modify: `backend/apps/planner/models.py`
- Modify: `backend/apps/planner/serializers.py`
- Modify: `backend/apps/planner/services.py`
- Modify: `backend/apps/planner/tests/test_event_visibility.py`
- Modify: `frontend/components/events/EventList.jsx`
- Modify: `frontend/components/events/EventModal.jsx`
- Modify: `frontend/components/dashboard/EventsPage.jsx`

- [ ] **Step 1: Add failing backend coverage for event completion and mode**

Add tests for:

```python
def test_creator_can_mark_event_completed(self):
    ...

def test_completed_event_is_still_visible_but_not_reminder_eligible(self):
    ...

def test_event_supports_solo_or_group_mode(self):
    ...
```

- [ ] **Step 2: Run planner tests to verify failure**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.planner.tests.test_event_visibility
```

Expected:

- FAIL or missing coverage

- [ ] **Step 3: Add the smallest new event quest fields**

Extend `Event` with:

- `is_completed`
- `quest_mode` (`solo`, `group`)

Do not rename the table or model class. Keep internal model name `Event`.

- [ ] **Step 4: Update frontend event quest semantics**

Change UI copy and card rendering so:

- route language says `Quest Planner`
- event cards say `Event Quest`
- create/edit form supports `solo/group`
- completed event quest is visually distinct

- [ ] **Step 5: Re-run targeted backend and frontend verification**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.planner.tests.test_event_visibility
```

and

```bash
cd frontend
npm test
npm run build
```

Expected:

- PASS

- [ ] **Step 6: Commit**

```bash
git add backend/apps/planner/models.py backend/apps/planner/serializers.py backend/apps/planner/services.py backend/apps/planner/tests/test_event_visibility.py frontend/components/events/EventList.jsx frontend/components/events/EventModal.jsx frontend/components/dashboard/EventsPage.jsx
git commit -m "Upgrade planner events into event quests"
```

## Task 4: Add Notifications And Reminders

**Files:**
- Create: `backend/apps/notifications/`
- Modify: `backend/apps/planner/services.py`
- Modify: `backend/apps/challenges/services.py`
- Modify: `backend/config/settings.py`
- Modify: `backend/config/urls.py`
- Create: `frontend/components/notifications/NotificationBell.jsx`
- Create: `frontend/components/notifications/NotificationCenter.jsx`
- Create: `frontend/components/notifications/NotificationPreferencesForm.jsx`
- Modify: `frontend/components/layout/Topbar.jsx`
- Modify: `frontend/components/dashboard/ProfilePage.jsx`
- Modify: `frontend/lib/api.js`

- [ ] **Step 1: Reuse the existing notification-only plan as the implementation base**

Use:

- `docs/superpowers/plans/2026-06-23-planquest-notifications-and-reminders.md`

as the detailed subplan for this task, not as the main product plan.

- [ ] **Step 2: Keep only the smallest full version**

Implement:

- persisted notifications
- email delivery
- in-app notification center
- preference toggles
- event reminders at `24h`, `1h`, `5m`
- challenge reminders for owner only
- invite sent / accepted / declined notifications

- [ ] **Step 3: Verify notification behavior end-to-end**

Check:

- invitee gets invite notification
- creator gets accept/decline notification
- reminders stop after event completion
- preferences disable channel delivery without deleting notification history

- [ ] **Step 4: Commit**

```bash
git add backend/apps/notifications backend/apps/planner/services.py backend/apps/challenges/services.py backend/config/settings.py backend/config/urls.py frontend/components/notifications frontend/components/layout/Topbar.jsx frontend/components/dashboard/ProfilePage.jsx frontend/lib/api.js
git commit -m "Add notifications and reminders"
```

## Task 5: Refresh Login And Sign-Up Screens

**Files:**
- Modify: `frontend/app/(auth)/login/page.jsx`
- Modify: `frontend/app/(auth)/register/page.jsx`
- Modify: `frontend/app/(auth)/layout.jsx`
- Modify: `frontend/components/auth/LoginForm.jsx`
- Modify: `frontend/components/auth/RegisterForm.jsx`

- [ ] **Step 1: Keep auth logic unchanged unless the mockup requires a missing input**

Do not expand auth scope into OAuth. Keep:

- email or username login
- email registration
- existing JWT flow

Treat Google/Facebook buttons as visual placeholders or disabled CTA shells in this phase.

- [ ] **Step 2: Rebuild the auth layout to match the mockups**

Implement:

- two-panel auth layout
- large visual/brand panel
- clearer hero copy
- cleaner spacing and form hierarchy
- separate visual treatment for login and register

- [ ] **Step 3: Keep form requirements aligned to the current backend**

Register must still submit the fields the backend expects today.

Login must still support:

- username or email
- password

Do not add:

- forgot-password backend flow
- remember-me persistence changes
- OAuth

unless they already exist or are separately planned.

- [ ] **Step 4: Add the smallest verification**

Verify:

- login still works
- register still works
- validation errors still surface correctly

Run:

```bash
cd frontend
npm test
npm run build
```

Expected:

- PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/app/(auth)/login/page.jsx frontend/app/(auth)/register/page.jsx frontend/app/(auth)/layout.jsx frontend/components/auth/LoginForm.jsx frontend/components/auth/RegisterForm.jsx
git commit -m "Refresh login and sign-up screens"
```

## Task 6: Rebuild The Dashboard As A Command Center

**Files:**
- Modify: `frontend/components/dashboard/DashboardOverviewPage.jsx`
- Create: `frontend/components/dashboard/DashboardStats.jsx`
- Create: `frontend/components/dashboard/FocusCards.jsx`
- Modify: `frontend/lib/api.js`
- Modify: `frontend/app/(dashboard)/dashboard/page.jsx`

- [ ] **Step 1: Add the smallest pure helper tests for dashboard grouping**

If extracted, cover:

```js
assert.equal(getTodaysFocusItems(items).length, 2);
assert.equal(getDeadlineUrgencyLabel(item), "Due soon");
```

Skip abstraction if the page can be kept small without it.

- [ ] **Step 2: Remove dashboard creation clutter**

Do not keep challenge creation embedded in the dashboard. The dashboard should aggregate, not host unrelated creation workflows.

- [ ] **Step 3: Add dashboard summary blocks**

Show:

- current streak
- quests done total
- total XP
- one more useful summary stat if the data already exists

- [ ] **Step 4: Add focus and deadlines sections**

Render:

- today’s focus cards
- upcoming deadlines side rail
- empty states that still fit the gamified direction

- [ ] **Step 5: Build and verify**

Run:

```bash
cd frontend
npm test
npm run build
```

Expected:

- PASS

- [ ] **Step 6: Commit**

```bash
git add frontend/components/dashboard/DashboardOverviewPage.jsx frontend/components/dashboard/DashboardStats.jsx frontend/components/dashboard/FocusCards.jsx frontend/lib/api.js frontend/app/(dashboard)/dashboard/page.jsx
git commit -m "Rebuild dashboard as command center"
```

## Task 7: Build Challenge Hub And Dedicated Create Flow

**Files:**
- Modify: `backend/apps/challenges/models.py`
- Modify: `backend/apps/challenges/serializers.py`
- Modify: `backend/apps/challenges/services.py`
- Modify: `frontend/components/dashboard/ChallengesPage.jsx`
- Create: `frontend/components/challenges/ChallengeHub.jsx`
- Create: `frontend/components/challenges/ChallengeCreateForm.jsx`
- Create: `frontend/app/(dashboard)/challenges/new/page.jsx`

- [ ] **Step 1: Add failing backend tests for richer challenge metadata**

Cover:

```python
def test_challenge_supports_streak_goal(self):
    ...

def test_challenge_supports_category_tags(self):
    ...

def test_challenge_reward_preview_has_stable_value(self):
    ...
```

- [ ] **Step 2: Run challenge tests to verify failure**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.challenges.tests
```

Expected:

- FAIL or missing coverage

- [ ] **Step 3: Add the smallest richer challenge fields**

Start with:

- `streak_goal_days`
- `category_tags` as JSON or simple text list if the existing DB setup makes that smaller

Do not implement collaborative challenges yet. Leave the seam, not the full system.

- [ ] **Step 4: Move challenge creation to a dedicated route**

Create:

- `/challenges/new`

with:

- title
- description
- streak goal
- optional deadline
- category tags
- reward preview

- [ ] **Step 5: Rework challenges route into a hub**

Render:

- active challenge cards
- log activity CTA
- milestones / reward rail
- create challenge CTA linking to the new route

- [ ] **Step 6: Run targeted verification**

Run:

```bash
cd frontend
npm test
npm run build
```

Expected:

- PASS

- [ ] **Step 7: Commit**

```bash
git add backend/apps/challenges/models.py backend/apps/challenges/serializers.py backend/apps/challenges/services.py frontend/components/dashboard/ChallengesPage.jsx frontend/components/challenges/ChallengeHub.jsx frontend/components/challenges/ChallengeCreateForm.jsx frontend/app/(dashboard)/challenges/new/page.jsx
git commit -m "Build challenge hub and dedicated create flow"
```

## Task 8: Rebuild Profile As Identity Plus Progress Surface

**Files:**
- Modify: `frontend/components/dashboard/ProfilePage.jsx`
- Create: `frontend/components/profile/ProfileProgressPanel.jsx`
- Create: `frontend/components/profile/SquadPanel.jsx`
- Modify: `frontend/components/profile/ProfileSummary.jsx`
- Modify: `frontend/lib/api.js`

- [ ] **Step 1: Keep the backend small**

Do not build a social graph here. Reuse:

- current user data
- progression summary
- achievements
- accepted collaborators or invitation-derived placeholders if needed

- [ ] **Step 2: Add progression-focused profile blocks**

Render:

- level
- XP progress to next level
- core stats
- achievement shelf

- [ ] **Step 3: Add a lightweight squad panel**

Show:

- accepted collaborators from event quest participation
- empty state if none exist

This is presentation only, not a friend system.

- [ ] **Step 4: Keep notification preferences here**

Embed the notification preferences form created in Task 4 so profile becomes the settings surface implied by the mockups.

- [ ] **Step 5: Verify**

Run:

```bash
cd frontend
npm test
npm run build
```

Expected:

- PASS

- [ ] **Step 6: Commit**

```bash
git add frontend/components/dashboard/ProfilePage.jsx frontend/components/profile/ProfileProgressPanel.jsx frontend/components/profile/SquadPanel.jsx frontend/components/profile/ProfileSummary.jsx frontend/lib/api.js
git commit -m "Rebuild profile as identity and progress surface"
```

## Task 9: Final Renewal Verification And Status Report

**Files:**
- Create: `docs/architecture/progression-and-reward-rules.md`
- Create: `docs/architecture/gamified-renewal-status-report.md`
- Modify: `README.md`

- [ ] **Step 1: Run backend suites**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test
```

Expected:

- PASS

- [ ] **Step 2: Run frontend checks**

Run:

```bash
cd frontend
npm test
npm run lint
npm run build
```

Expected:

- PASS

- [ ] **Step 3: Manual route verification**

Verify:

- dashboard feels like a command center
- planner route uses event-quest framing
- challenge creation is not embedded in the dashboard
- challenge hub has a dedicated creation entry point
- profile exposes progression and preferences
- notifications and reminders work across invitation and reminder flows

- [ ] **Step 4: Write reward and progression rules doc**

Document:

- XP sources
- level thresholds
- reminder-triggered notifications
- deferred balancing decisions

- [ ] **Step 5: Write renewal status report**

Include:

- what was completed
- what remains intentionally incomplete
- why it remains incomplete
- next likely phase

- [ ] **Step 6: Commit**

```bash
git add docs/architecture/progression-and-reward-rules.md docs/architecture/gamified-renewal-status-report.md README.md
git commit -m "Document gamified renewal status"
```

## Self-Review

### Spec Coverage

- [ ] renewed product direction covered
- [ ] event quest and challenge split preserved
- [ ] notifications/reminders included as one track
- [ ] auth refresh covered
- [ ] dashboard overhaul covered
- [ ] challenge hub covered
- [ ] profile overhaul covered
- [ ] progression groundwork covered

### Placeholder Scan

- [ ] no `TODO`
- [ ] no `TBD`
- [ ] no fake assumption that group challenges are already solved

### Consistency Check

- [ ] event quests belong to planner everywhere
- [ ] challenges remain challenges everywhere
- [ ] notifications are support systems, not the only plan
- [ ] profile owns preferences in the renewed UX

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-23-planquest-gamified-renewal-plan.md`.

Two execution options:

1. Subagent-Driven (recommended) - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. Inline Execution - Execute tasks in this session using executing-plans, batch execution with checkpoints
