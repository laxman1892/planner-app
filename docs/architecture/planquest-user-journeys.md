# PlanQuest User Journeys

## Journey 1: Auth, Onboarding, And Dashboard Entry

### Actor

New or returning user.

### Trigger

The user wants to create an account or sign in and immediately understand their current progress and priorities.

### Happy Path

1. The user lands on the renewed login or sign-up screen.
2. The user registers with name, username, email, and password or signs in with username/email plus password.
3. The backend returns JWT tokens and current user data.
4. The frontend stores session tokens and loads progression, event quests, challenges, achievements, and notifications.
5. The user lands on the dashboard command center.
6. The dashboard shows current streak, total XP, completed quests count, and today’s focus.

### Edge Cases

- Registration fails because of duplicate email/username or password validation.
- Login fails because credentials are invalid.
- Stored tokens exist but session/bootstrap loading fails; the frontend clears the session.
- Social login buttons may appear in the UI, but they are presentation-only until OAuth is explicitly implemented.

### Renewed Experience Goal

- Auth should feel like the start of a growth journey, not a plain utility form.
- The first authenticated screen should explain current state and next actions without the user hunting through routes.

## Journey 2: Planner Event Quest Creation And Collaboration

### Actor

Authenticated user who wants to schedule a meaningful activity and optionally involve collaborators.

### Trigger

The user wants to create or manage an event quest.

### Happy Path

1. The user opens the planner route.
2. The user creates an event quest with title, date, time, category, and solo/group mode.
3. If the event quest is group-based, the user adds collaborators by email or username.
4. The event quest appears in the planner view with event-quest language and clearer status cues.
5. Invitees receive a notification and email.
6. Accepted collaborators can see the event quest in their planner context.
7. The creator or accepted collaborator receives reminders before the event quest starts.
8. The creator can mark the event quest complete.

### Edge Cases

- The creator cannot invite themselves.
- Duplicate invitations are rejected.
- Pending or declined invitees do not see the full event quest in the main planner feed.
- Expired invitations are visible as records but are no longer actionable.
- Completed event quests should stop future reminders.

### Renewed Experience Goal

- Planner should feel like a quest-planning board, not generic event CRUD.
- Collaboration should feel intentional without yet becoming a full social network.

## Journey 3: Challenge Creation, Logging, And Reward Loop

### Actor

Authenticated user who wants a longer-running growth mechanic separate from planner scheduling.

### Trigger

The user wants to create a challenge, log activity, track streak progress, and earn rewards.

### Happy Path

1. The user opens the challenges route.
2. The user sees a challenge hub with active challenge cards, progression summaries, and a dedicated create CTA.
3. The user opens the dedicated challenge creation route.
4. The user creates a challenge with title, description, streak goal, optional deadline, and tags.
5. The challenge appears in the challenge hub with stronger progress and reward cues.
6. The user logs activity over time.
7. The user receives reminder notifications or emails if the challenge is still active.
8. Completing the challenge contributes to achievements and XP.

### Edge Cases

- Challenge creation fails because required fields are missing.
- Completed challenges reject new logs.
- Group challenge behavior remains deferred and should not be implied as already supported.
- Reward preview may be approximate until progression balancing becomes more mature.

### Renewed Experience Goal

- Challenges should feel like a distinct growth loop, not a renamed planner event.
- The route should reinforce progress and motivation even before full reward balancing exists.

## Journey 4: Profile, Progress, And Preferences

### Actor

Authenticated user who wants to review identity, growth, achievements, and settings.

### Trigger

The user opens the profile route.

### Happy Path

1. The user sees a profile route framed as identity plus progress.
2. The route displays level, XP progress, challenge/event-quest summary metrics, and achievements.
3. The route shows a lightweight squad/allies area derived from collaboration data or placeholders.
4. The user updates notification preferences such as invite emails and reminders.
5. The user keeps using the product with settings that affect in-app and email delivery behavior.

### Edge Cases

- No squad/allies data exists yet, so the panel should show an intentional empty state.
- Notification preferences may disable email while still keeping in-app notifications.
- Public profile, mentions, DMs, and social graph behavior remain out of scope.

### Renewed Experience Goal

- Profile should feel like a progression surface, not just an account form.
- Preferences should be embedded where the user expects them, especially notification controls.
