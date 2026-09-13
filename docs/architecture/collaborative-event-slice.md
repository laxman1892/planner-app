# Collaborative Event Slice

## Purpose

This document records the first production-style collaboration slice implemented in Phase 5.

The slice proves that PlanQuest now supports a real invitation lifecycle around planner events, while still keeping the collaboration scope intentionally narrow and reviewable.

## Implemented Contract

### Creator Flow

- A creator can create an event.
- A creator can invite another user through the invitation API.
- A creator can see invitation status grouped against their own events in the frontend.

### Pending Invitee Flow

- A pending invitee can see an invitation-specific surface in the frontend.
- That surface shows a limited preview only:
  - event title
  - event time
  - event category
  - creator identity
  - invitation status
- The pending invitee cannot access the event through the normal event list/detail flow before acceptance.

### Accepted Invitee Flow

- An accepted invitee gains normal event visibility through the main event API.
- Accepted participants remain read-only in the current slice.

### Declined Invitee Flow

- A declined invitee does not see the event in the normal event flow.

### Expired Invitation Flow

- A pending invitation expires `12 hours` after creation.
- Expired invitations become non-actionable.
- Expired invitations do not grant shared event visibility.
- The frontend can display expired invitation state in invitation/status surfaces.

## Backend Behavior

Implemented in the planner domain:

- invitation preview fields are exposed on invitation responses
- invitation reads are available to the creator and invited user
- only the invited user can change their own invitation status
- expired invitations are converted to explicit `expired` state when read or updated
- expired invitations reject accept/decline mutation
- event visibility remains limited to creators and accepted participants

## Frontend Behavior

Implemented in the events dashboard:

- a dedicated invitation panel for invitee-facing limited preview
- accept/decline actions for pending invitations
- creator-side invitation status display alongside creator-owned events

Not implemented in this slice:

- invitation creation UI in the frontend
- revoke invitation flow
- re-invitation flow
- invitation expiration countdown/timer UI
- participant event editing

## Verification Evidence

Automated checks run during Task 5:

- backend full suite: `37` tests passed
- targeted collaboration suite: `19` tests passed
- frontend tests: `26` tests passed
- frontend lint: passed
- frontend production build: passed

## Manual Verification Status

Automated coverage is in place, but the slice still needs one manual browser pass with two accounts to close the last acceptance step.

Manual checks still required:

- User A creates an event
- User A invites User B
- User B sees limited preview only
- User B accepts or declines before expiration
- User A sees updated status
- Accepted event appears in User B normal event list
- Declined or expired event does not appear in User B normal event list

## Intentional Limits

This slice is deliberately not a full collaboration platform.

It is meant to prove:

- invitation lifecycle is real
- pending visibility is intentional
- shared event visibility is role-based
- the frontend and backend now express the same collaboration rule set

Further collaboration features should build on this contract instead of widening it implicitly.
