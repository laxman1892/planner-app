# PlanQuest Domain Rules

## Purpose

This document separates current behavior from recommended MVP policy so the product can stay honest while collaboration rules are hardened.

Unless a rule appears under `Current Behavior`, treat it as a target MVP policy decision for future backend/frontend hardening, not as something already enforced by the code today.

## Phase 3 Backend Note

Phase 3 updated backend collaboration semantics without adding new database migrations.

That means some ownership, visibility, and invitation rules changed through services, permissions, serializers, and view logic rather than through schema evolution.

## Event Visibility

### Current Behavior

- Events are visible to their creator.
- Events are also visible to accepted participants.
- Pending participants cannot view event list/detail.
- Declined participants cannot view event list/detail.
- Event edits and deletes are owner-only.
- Accepted participants are read-only for the event itself.

### Target MVP Policy

- An event has one owner: the creator.
- The creator can always view, edit, and delete the event.
- Invited users should not gain event access until there is an explicit invitation record.
- Pending invitees may see the invitation record and participation status, but not full event detail or planner visibility until they accept.
- Accepted participants should be able to view the event in their own planner context.
- Declined participants should stop seeing the event as an active shared plan.

### Deferred Decisions

- Whether accepted participants can edit anything beyond their own participation status.
- Whether event comments, notes, or activity history belong in MVP.

## Invitations

### Current Behavior

- `EventParticipant` supports `pending`, `accepted`, and `declined` states.
- Only the event creator can create invitations.
- Duplicate invitations for the same event/user pair are rejected.
- The event creator cannot invite themselves.
- The invited user can update their own invitation status.
- The event creator can view invitation status.
- The event creator cannot impersonate the invited user's response state.
- Unrelated users cannot view invitation records.
- There is no finished frontend invitation inbox or accept/decline experience.

### Target MVP Policy

- Only the event creator can create invitations.
- Invitations should be unique per event/user pair.
- Only the invited user can change their own invitation status between `pending`, `accepted`, and `declined`.
- The creator can view invitation status, but should not impersonate participant responses.
- Duplicate invites and invalid status transitions should be rejected.

### Deferred Decisions

- Whether creators can revoke invitations after they are sent.
- Whether a declined user can be re-invited automatically or only through a deliberate re-open flow.
- Whether invitations should expire.

## Challenge Visibility And Progress Permissions

### Current Behavior

- Challenges are creator-only in queryset behavior.
- New challenges are forced to `self` type on creation.
- Progress can only be logged by the authenticated user on challenges they own.
- Challenge completion is owner-only.
- Progress updates and deletes are owner-only.
- Completed challenges reject new progress logs.
- Group challenge input is not supported as a real workflow even though the enum still exists in the model.

### Target MVP Policy

- MVP should explicitly remain personal challenges only.
- The challenge creator is the only user who can view, update, complete, or delete the challenge.
- The challenge creator is the only user who can log progress.
- One progress entry per user, per challenge, per date remains the rule.

### Deferred Decisions

- Whether group challenges belong in V1 at all.
- If group challenges are added later, who can invite participants, who can log progress, and how shared completion is resolved.
- Whether participant progress should stay individual or roll up into one shared completion state.

## Achievement Visibility

### Current Behavior

- Achievements are read-only through the API.
- Users can list only their own achievements.
- Achievement awarding is driven by challenge completion and progress streak logic.
- Achievement awarding is triggered through challenge service calls rather than directly from challenge view code.

### Target MVP Policy

- Achievements remain private to the authenticated user in MVP.
- Achievements support motivation and retention, but do not imply a broader public social feed.
- Achievement rules should remain idempotent so repeated actions do not create duplicate badges.

### Deferred Decisions

- Whether achievements should become profile-visible to other users.
- Whether achievements should be attached to collaborative milestones rather than only personal challenge milestones.
- Whether badge rarity, points, or leaderboards are worth adding.

## Recommended MVP Policy Decisions Summary

- Position the app as planner-first collaborative accountability.
- Treat personal planning and personal challenges as the honest implemented core.
- Make collaborative event planning the next hardening target, not a finished promise.
- Keep challenges personal for MVP.
- Keep achievements private and supporting.

## Deferred Decisions Summary

- Participant-facing event visibility details.
- Invitation revocation and expiration rules.
- Group challenge ownership, participation, and completion logic.
- Public profile and achievement visibility.
- Real-time or notification-driven social behavior.
