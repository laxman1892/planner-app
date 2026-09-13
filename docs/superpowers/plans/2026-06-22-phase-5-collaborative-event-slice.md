# Phase 5 Collaborative Event Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the first production-style collaboration slice with invitation preview, accept/decline flow, creator status visibility, and 12-hour invitation expiration.

**Architecture:** Keep normal event visibility strict: only creators and accepted participants see events through the main event API. Add pending invitee preview and expiration through the invitation API so invitation-specific behavior stays separate from shared-event behavior. Build the frontend around a small invitation surface first, then layer creator status visibility into existing event UI.

**Tech Stack:** Django 5, Django REST Framework, Next.js 15 App Router, React 19, Node test runner, GitHub Actions

---

## File Structure Strategy

### Backend

- Modify `backend/apps/planner/models.py`
  - add the `expired` invitation status and any small model helpers needed for expiration checks
- Modify `backend/apps/planner/services.py`
  - centralize invitation preview and expiration-aware mutation behavior
- Modify `backend/apps/planner/serializers.py`
  - expose limited preview fields and enforce allowed status changes
- Modify `backend/apps/planner/views.py`
  - keep using invitation queryset, but ensure the serializer contract is used for creator/invitee read flows
- Modify `backend/apps/planner/tests/test_event_invitations.py`
  - add invitation preview and expiration coverage
- Modify `backend/apps/planner/tests/test_event_visibility.py`
  - add accepted/declined/expired visibility checks if needed

### Frontend

- Modify `frontend/lib/api.js`
  - add invitation read/update helpers if current event helpers are not enough
- Create `frontend/components/events/InvitationList.jsx`
  - invitee-facing limited preview list with accept/decline actions
- Create `frontend/components/events/InvitationCard.jsx`
  - focused invitation preview row/card
- Modify `frontend/components/dashboard/EventsPage.jsx`
  - show invitation section for invitee flow
- Modify `frontend/components/events/EventList.jsx`
  - optionally annotate creator-owned events with participant status summaries if needed
- Modify `frontend/components/events/EventModal.jsx`
  - creator invitation controls/status display only if this is the smallest place to surface them

### Docs

- Modify `docs/architecture/planquest-domain-rules.md`
  - align MVP rules to limited preview + 12-hour expiration
- Create `docs/architecture/collaborative-event-slice.md`
  - summarize the final implemented Phase 5 slice after code lands

## Task 1: Backend Invitation Contract

**Files:**
- Modify: `backend/apps/planner/models.py`
- Modify: `backend/apps/planner/serializers.py`
- Modify: `backend/apps/planner/services.py`
- Test: `backend/apps/planner/tests/test_event_invitations.py`

- [ ] **Step 1: Write failing tests for limited preview and expiration state**

Add tests covering:

```python
def test_invited_user_can_view_limited_preview_fields(self):
    ...

def test_expired_invitation_cannot_be_accepted(self):
    ...

def test_expired_invitation_cannot_be_declined(self):
    ...
```

- [ ] **Step 2: Run targeted invitation tests to verify failure**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.planner.tests.test_event_invitations
```

Expected:

- tests fail because preview fields and expiration behavior do not exist yet

- [ ] **Step 3: Add the minimal backend contract**

Implement:

- `expired` invitation status in `EventParticipant.Status`
- a helper for `is_expired` using `invited_at + 12 hours`
- serializer output that includes preview event fields and creator-facing/invitee-facing identity fields
- mutation guard so expired invitations cannot transition to accepted/declined

- [ ] **Step 4: Run targeted invitation tests again**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.planner.tests.test_event_invitations
```

Expected:

- PASS for new invitation preview/expiration tests

- [ ] **Step 5: Commit**

```bash
git add backend/apps/planner/models.py backend/apps/planner/serializers.py backend/apps/planner/services.py backend/apps/planner/tests/test_event_invitations.py
git commit -m "Add invitation preview and expiration rules"
```

## Task 2: Backend Event Visibility Regression Coverage

**Files:**
- Modify: `backend/apps/planner/services.py`
- Test: `backend/apps/planner/tests/test_event_visibility.py`

- [ ] **Step 1: Write failing tests for accepted, declined, and expired visibility outcomes**

Add tests covering:

```python
def test_pending_invitee_does_not_see_event_in_main_event_list(self):
    ...

def test_accepted_invitee_sees_event_in_main_event_list(self):
    ...

def test_expired_invitee_does_not_see_event_in_main_event_list(self):
    ...
```

- [ ] **Step 2: Run targeted event visibility tests to verify failure or missing coverage**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.planner.tests.test_event_visibility
```

Expected:

- either a failing expired-case test or missing coverage for the new contract

- [ ] **Step 3: Implement the smallest visibility adjustment**

Implement only what is needed so:

- pending invitees stay out of main event visibility
- accepted invitees remain visible
- expired invitees stay out of main event visibility

- [ ] **Step 4: Run targeted event visibility tests again**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.planner.tests.test_event_visibility
```

Expected:

- PASS

- [ ] **Step 5: Commit**

```bash
git add backend/apps/planner/services.py backend/apps/planner/tests/test_event_visibility.py
git commit -m "Cover invitation visibility states"
```

## Task 3: Invitee Invitation Surface

**Files:**
- Create: `frontend/components/events/InvitationCard.jsx`
- Create: `frontend/components/events/InvitationList.jsx`
- Modify: `frontend/components/dashboard/EventsPage.jsx`
- Modify: `frontend/lib/api.js`
- Test: `frontend/components/events` or adjacent pure helpers if extracted

- [ ] **Step 1: Add the smallest failing frontend check or helper test**

Prefer a pure helper test if display logic is extracted, for example:

```js
assert.equal(getInvitationActionState(invitation).canRespond, false)
```

If no helper extraction is needed, skip adding extra abstraction and rely on manual verification later.

- [ ] **Step 2: Add invitation API helpers**

Implement minimal helpers for:

- listing invitations for the current user
- updating invitation status

- [ ] **Step 3: Build invitation preview components**

Show only:

- creator
- title
- time
- category
- status
- accept/decline actions

- [ ] **Step 4: Wire the invitation section into the events dashboard**

Ensure:

- pending invitees see invitation preview separate from the normal event list
- accepted events still appear through the normal event list
- expired invitations show as expired and non-actionable

- [ ] **Step 5: Run frontend tests and build**

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
git add frontend/components/events/InvitationCard.jsx frontend/components/events/InvitationList.jsx frontend/components/dashboard/EventsPage.jsx frontend/lib/api.js
git commit -m "Add invitee invitation preview UI"
```

## Task 4: Creator Invitation Status Display

**Files:**
- Modify: `frontend/components/events/EventList.jsx`
- Modify: `frontend/components/events/EventModal.jsx`
- Modify: `frontend/components/dashboard/EventsPage.jsx`

- [ ] **Step 1: Add creator-side status display in the smallest existing event UI seam**

Show:

- invited user
- current invitation status
- expired state when applicable

- [ ] **Step 2: Keep creator actions minimal**

Do not add revoke/reinvite flows.

- [ ] **Step 3: Run frontend tests and build**

Run:

```bash
cd frontend
npm test
npm run build
```

Expected:

- PASS

- [ ] **Step 4: Commit**

```bash
git add frontend/components/events/EventList.jsx frontend/components/events/EventModal.jsx frontend/components/dashboard/EventsPage.jsx
git commit -m "Show creator invitation status"
```

## Task 5: Full Verification And Slice Docs

**Files:**
- Create: `docs/architecture/collaborative-event-slice.md`
- Modify: `README.md` if user-facing scope wording changes

- [ ] **Step 1: Run full backend test suite**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test
```

Expected:

- PASS

- [ ] **Step 2: Run targeted collaboration tests**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.planner.tests.test_event_invitations apps.planner.tests.test_event_visibility
```

Expected:

- PASS

- [ ] **Step 3: Run frontend quality checks**

Run:

```bash
cd frontend
npm test
npm run lint
npm run build
```

Expected:

- PASS

- [ ] **Step 4: Manually verify with two users**

Check:

- User A creates event
- User A invites User B
- User B sees limited preview only
- User B accepts or declines before expiration
- User A sees updated status
- Accepted event appears in User B normal event list
- Declined or expired event does not appear in User B normal event list

- [ ] **Step 5: Write final slice doc**

Document:

- final API/UI contract
- accepted limitations
- expiration rule
- what remains intentionally out of scope

- [ ] **Step 6: Commit**

```bash
git add docs/architecture/collaborative-event-slice.md README.md
git commit -m "Document collaborative event slice"
```
