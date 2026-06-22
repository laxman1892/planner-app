# PlanQuest User Journeys

## Journey 1: Onboarding, Auth, And Basic Profile

### Actor

New or returning user.

### Trigger

The user wants to create an account, sign in, and start using their planner.

### Happy Path

1. The user opens the frontend auth experience.
2. The user registers with email, username, name, and password.
3. The backend returns JWT tokens and serialized user data.
4. The user signs in with email or username plus password.
5. The frontend stores access and refresh tokens in local storage.
6. The app loads the current profile, events, challenges, and achievements for the authenticated user.
7. The user lands in the dashboard and sees their planner and accountability data.

### Edge Cases

- Registration fails because of validation errors such as duplicate email/username or weak password.
- Login fails because credentials are invalid.
- Stored tokens exist but profile loading fails; the frontend clears session state and returns the user to auth mode.
- Profile picture is supported by the backend serializer, but the current frontend registration form does not expose upload controls.
- Profile updates are supported by the backend API, but the current frontend does not provide a dedicated profile editing flow.

### Supported Today

Backend:

- `backend/apps/accounts/views.py`
- `backend/apps/accounts/serializers.py`
- `backend/apps/accounts/tests.py`

Frontend:

- `frontend/components/auth/AuthExperience.jsx`

### Current Coverage Assessment

- Well supported for registration, login, session persistence, and profile retrieval.
- Partially supported for profile management because the API exists but the frontend experience is minimal.

## Journey 2: Collaborative Event Planning

### Actor

Authenticated planner user who wants to organize a commitment and, eventually, share it with someone else.

### Trigger

The user wants to add an upcoming event, update it, or manage who is involved.

### Happy Path

1. The user signs in and opens the planner area.
2. The user creates a new event with title, date/time, category, and description.
3. The event appears in the user's event list.
4. The user can edit or delete that same event later.
5. In the intended product direction, the user would next invite participants and track invitation state.

### Edge Cases

- Event creation fails if required fields such as description are missing.
- A user cannot update or delete another user's event.
- The current event list only returns events created by the authenticated user.
- `EventParticipant` records exist in the backend, but invited users do not yet receive a complete frontend flow for seeing, accepting, or declining invitations.
- The frontend event form currently behaves like a personal event workflow even though the broader product direction is collaborative planning.

### Supported Today

Backend:

- `backend/apps/planner/models.py`
- `backend/apps/planner/serializers.py`
- `backend/apps/planner/views.py`
- `backend/apps/planner/tests.py`

Frontend:

- `frontend/components/auth/AuthExperience.jsx`

### Current Coverage Assessment

- Strong support for personal event CRUD.
- Partial support for collaboration because participant models and endpoints exist, but shared visibility and invitation lifecycle are not yet a finished user journey.

## Journey 3: Personal Challenge Progress And Achievements

### Actor

Authenticated user who wants to stay accountable on a personal goal.

### Trigger

The user wants to create a challenge, log progress, complete it, and see earned badges.

### Happy Path

1. The user signs in and opens the challenges area.
2. The user creates a self challenge with title, description, and optional deadline.
3. The challenge appears in the user's challenge list.
4. The user logs one progress entry for a given date.
5. The frontend updates the challenge's visible progress logs.
6. The user marks the challenge complete.
7. Achievement logic awards qualifying badges, and the frontend reloads the achievement shelf.

### Edge Cases

- Challenge creation fails if description is missing.
- A user cannot see, update, or delete another user's challenge.
- A user cannot log progress for another user's challenge.
- A user cannot log more than one progress entry per challenge per day.
- Completed challenges reject new progress logs.
- The data model includes group challenge fields, but the current creation flow forces self challenges only and does not expose participant management.

### Supported Today

Backend:

- `backend/apps/challenges/models.py`
- `backend/apps/challenges/serializers.py`
- `backend/apps/challenges/views.py`
- `backend/apps/challenges/tests.py`
- `backend/apps/achievements/services.py`
- `backend/apps/achievements/views.py`
- `backend/apps/achievements/tests.py`

Frontend:

- `frontend/components/auth/AuthExperience.jsx`

### Current Coverage Assessment

- Well supported for personal accountability.
- Not yet ready to be described as a group challenge system.
