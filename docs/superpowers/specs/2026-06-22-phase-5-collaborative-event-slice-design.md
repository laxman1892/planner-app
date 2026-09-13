# Phase 5 Collaborative Event Slice Design

## Goal

Define the first production-style collaboration slice for PlanQuest so invitation behavior, pending invitee visibility, and participant-facing event access are explicit before backend and frontend work begin.

## Scope

This slice covers:

- register and login using the existing auth flow
- profile read/update using the existing profile flow
- event creation by the event creator
- event invitation creation by the event creator
- invitation accept/decline by the invited user
- invitation status visibility for the creator
- event visibility rules for pending, accepted, and declined invitees

This slice does not cover:

- invitation revocation
- automatic re-invitation flows
- comments, chat, or event activity feeds
- participant editing of event data

## Product Decision: Pending Invitee Visibility

Pending invitees use a limited preview policy.

That means a pending invitee:

- can see an invitation record addressed to them
- can see a limited preview of the invited event
- can accept or decline the invitation
- cannot access the full event detail flow until they accept
- should not see the invitation as a normal shared event in their main event list while still pending

The limited preview contains only:

- event title
- event start date/time
- event end date/time
- event category
- creator display identity
- invitation status

The limited preview does not include:

- full event description/body
- normal participant event detail access
- creator-only event management actions

## Backend Design

The existing event visibility rule stays mostly intact:

- creator can see and manage their own events
- accepted participants can see shared events in the normal event flow
- declined participants cannot see shared events
- pending invitees still cannot see the full event through the main event queryset

Pending preview should come from the invitation API, not by widening the normal event API.

Reason:

- it keeps the privacy boundary explicit
- it avoids mixing pending invites with accepted shared events
- it lets the frontend build an invitation inbox without special-casing the main event list

### Invitation API Contract

The invitation list/detail payload for creator or invitee should include:

- invitation id
- event id
- invited user id
- invited user identity fields needed by creator-facing UI
- creator identity fields needed by invitee-facing UI
- invitation status
- preview event fields:
  - title
  - start_time
  - end_time
  - category

Behavior rules:

- only event creator can create invitations
- only invited user can change invitation status
- creator can read invitation state
- invitee can read invitation state
- unrelated users cannot read invitation state
- pending invitee preview is allowed only through invitation endpoints
- accepted invitee gains normal shared-event visibility through the event endpoints
- declined invitee loses shared-event visibility and remains outside the normal event flow

### Status Mutation Rules

Allowed transitions for MVP:

- `pending -> accepted`
- `pending -> declined`

Disallowed transitions for MVP:

- creator setting invitee response on their behalf
- unrelated user changing invitation state
- duplicate invitation creation

Expiration rule for MVP:

- a pending invitation expires `12 hours` after creation
- an expired invitation is no longer actionable
- an expired invitation does not grant normal event visibility
- an expired invitation should be represented explicitly as `expired`, not treated as `declined`

For now, once an invitation is no longer pending, there is no re-invitation flow in scope.

## Frontend Design

The frontend should separate invitation surfaces from event surfaces.

### Pending Invitee Experience

Pending invitees should see an invitation list or invitation section showing:

- creator
- event title
- event time
- category
- current status
- accept action
- decline action

They should not be able to open the normal event detail/edit experience until the invitation is accepted.

### Creator Experience

Creators should be able to:

- create an event
- invite a participant
- see invitation status for that event

The creator does not need a separate inbox. The status can live in event management UI as long as the invitation state is clearly visible.

### Accepted Participant Experience

After accepting:

- the event should appear in the participant's normal event view
- the participant sees the shared event as read-only unless later policy expands editing rights

### Declined Participant Experience

After declining:

- the event should not appear in the participant's normal event view
- the invitation may still appear as declined in an invitation-focused surface if we choose to keep history visible, but that is secondary to MVP

### Expired Invitation Experience

After expiration:

- the event should not appear in the participant's normal event view
- the invitee should see that the invitation expired
- the invitee should not be able to accept or decline it anymore

## Data Flow

1. Creator creates event.
2. Creator sends invitation for that event.
3. Invitee sees invitation row with limited preview through invitation API.
4. Invitee accepts or declines from the invitation surface before the `12 hour` expiry.
5. Creator sees updated invitation status.
6. If accepted, the event enters the participant's normal shared-event visibility.
7. If declined or expired, the event stays out of the participant's normal event flow.

## Error Handling

The slice should handle these cases clearly:

- duplicate invitation
- creator inviting themselves
- unauthorized invitation creation
- unauthorized invitation response mutation
- invalid invitation state transition
- acceptance attempt after expiration
- invitee attempting to open a full event before acceptance

Backend should reject these requests explicitly.

Frontend should show short actionable errors, not silent failure.

## Testing Expectations

Backend tests should prove:

- creator can invite
- invitee can see invitation preview
- pending invitee cannot access full event detail/list
- invitee can accept
- invitee can decline
- expired invitation cannot be accepted or declined
- creator sees updated invitation status
- accepted participant sees shared event in normal event flow
- declined participant does not see shared event in normal event flow
- expired invitation does not surface as a shared event
- unrelated users cannot inspect invitation state

Frontend verification should prove at minimum:

- invitee sees limited preview, not full event management UI
- invitee can accept/decline
- creator sees invitation status reflected in UI

## Implementation Shape

Phase 5 should be split into these steps:

1. Lock the invitation API contract and pending-preview rule.
2. Implement backend invitation preview and status mutation behavior.
3. Build invitee invitation inbox/section with limited preview actions.
4. Show creator-side invitation status in event UI.
5. Run end-to-end verification for creator, pending invitee, accepted participant, and declined participant.
6. Document the slice and regressions.

## Recommended First Step

Step 1 should produce:

- this approved design
- updated domain/rules documentation aligned to limited preview policy
- a concrete implementation plan for backend and frontend tasks

No broader collaboration features should be added before that contract is fixed.
