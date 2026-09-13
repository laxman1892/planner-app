# PlanQuest Domain Rules

## Purpose

This document defines the renewed product rules for PlanQuest as it shifts into a gamified growth system.

The central constraint remains:

- planner items are `event quests`
- challenges remain `challenges`
- both can contribute to progression
- they do not collapse into one domain object

Unless a rule appears under `Current Behavior`, treat it as a target rule for the renewal rather than something already fully enforced by the code today.

## Event Quests

### Current Behavior

- Events are creator-owned records.
- Accepted participants can view shared events.
- Pending and declined invitees do not gain main event visibility.
- Event edit/delete behavior is owner-only.

### Renewal Policy

- `Event` remains the backend model name.
- The frontend and product language should present it as an `Event Quest`.
- An event quest has one creator.
- An event quest may be `solo` or `group`.
- The creator can always view, edit, complete, and delete the event quest.
- Accepted participants can view the event quest in their planner context.
- Accepted participants remain read-only unless a later policy explicitly expands collaborator permissions.
- An event quest may be marked complete.
- Completed event quests should remain visible in history until deleted, but they should stop future reminders.

### Deferred Decisions

- Whether accepted participants can edit notes or other subfields.
- Whether event-quest comments or activity history are part of the renewal.

## Invitations

### Current Behavior

- `EventParticipant` supports pending, accepted, declined, and expired semantics.
- Only the creator can send invitations.
- Duplicate invites for the same event/user pair are rejected.
- Invitees control their own response state.

### Renewal Policy

- Only the event quest creator can invite collaborators.
- Invitations are unique per event quest and user.
- The creator cannot invite themselves.
- Only the invited user can change response state.
- Pending invitations expire after `12 hours`.
- Expired invitations remain visible as records but are no longer actionable.
- The creator can see invitation status but cannot impersonate a participant response.

### Deferred Decisions

- Reinvite or revoke flows.
- Long-term archival behavior for declined or expired invitations.

## Challenges

### Current Behavior

- Challenges are creator-only in practice.
- Logging and completion are creator-only.
- Group challenge UI is not implemented as a real workflow.

### Renewal Policy

- Challenges remain separate from event quests.
- The challenge creator is the only user who can view, update, log, complete, or delete the challenge in this renewal phase.
- Challenges may gain richer metadata such as streak goals, tags, and reward cues.
- Group challenge collaboration remains deferred until intentionally designed.

### Deferred Decisions

- Whether collaborative challenges belong in the next major phase.
- If collaborative challenges are added later, who can invite, log, and complete.

## Progression

### Renewal Policy

- Progression is account-level.
- Event quests and challenges may both award XP.
- XP rules should be deterministic and centralized.
- Achievement awarding should remain idempotent.
- Per-item progress and account-level progression must remain separate concepts.

### Minimum Progression Concepts

- total XP
- level
- next level target
- streak-related contribution points or summary values if implemented

### Deferred Decisions

- final XP balancing
- rarity weighting
- public leaderboards
- competitive ranking systems

## Notifications And Reminders

### Current Behavior

- No real notification center exists yet.
- No email reminder system exists yet.

### Renewal Policy

- Notifications are a first-class product system.
- Every email-worthy notification should also exist as a persisted in-app notification record.
- Collaboration notifications use both in-app and email channels when preferences allow.
- Event quest reminders use both in-app and email channels when preferences allow.
- Challenge reminders use both in-app and email channels when preferences allow.

### Reminder Rules

- Event quest reminders fire at:
  - `24 hours` before start
  - `1 hour` before start
  - `5 minutes` before start
- Event quest reminders go to:
  - creator
  - accepted participants
- Event quest reminders do not go to:
  - pending invitees
  - declined invitees
  - expired invitees
- Completed event quests stop future reminders.
- Challenge reminders go to the challenge creator only in this renewal phase.
- Completed challenges stop future reminders.

### Preference Rules

- Notification preferences belong in the profile/settings experience.
- Preferences may disable email without disabling in-app delivery.
- Preferences may disable in-app without disabling email.

## Profile And Social Surface

### Renewal Policy

- Profile should function as identity plus progress, not just account editing.
- Profile may show a lightweight squad/allies surface derived from accepted collaboration data.
- This squad/allies surface is presentation, not a full social graph.
- Public profile, DMs, mentions, and real friend systems remain deferred.

## Vocabulary Rules

- Use `Event Quest` in planner-facing UI.
- Use `Challenge` in challenge-facing UI.
- Use `Log Activity` instead of raw progress-log phrasing where it improves clarity.
- Use squad, allies, party members, or collaborators as presentation terms only where the route context supports them.
- Do not rename backend models aggressively just to match UI language.

## Recommended Renewal Policy Summary

- Position the app as a gamified productivity growth system.
- Keep event quests and challenges separate.
- Make progression, notifications, and reminders core systems.
- Use profile as the preferences and progress surface.
- Keep collaborative challenges, social graph behavior, and OAuth out of this renewal unless explicitly added later.

## Deferred Decisions Summary

- collaborator edit rights on event quests
- collaborative challenge design
- friend graph and DMs
- leaderboard visibility
- final XP economy balancing
- OAuth and other social sign-in flows
