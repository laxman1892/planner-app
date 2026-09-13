# PlanQuest Gamified UI Direction

## Purpose

This document records the product, logic, and UI-behavior changes implied by the new visual direction.

The mockups shift PlanQuest from a planner-first accountability tool with supporting gamification into a more explicitly gamified growth system. The app still keeps planning and collaboration, but the primary user-facing language, feedback loop, and screen structure now center on:

- event quests
- challenges
- XP
- levels
- streaks
- achievements
- squads / allies
- milestone-driven progression

This document is not an implementation plan. It is the logic-and-behavior reference for updating the existing architecture and roadmap toward the new product posture.

## High-Level Product Shift

## Previous Direction

PlanQuest was previously framed as:

- planner-first collaborative accountability

That framing emphasized:

- personal event management
- self-challenges as a supporting system
- achievements as a secondary retention layer

## New Direction

The mockups suggest a new primary framing:

- gamified productivity growth system with planner and collaboration support

That means:

- the user should feel like they are progressing through a game-like productivity system
- planner events should adopt event-quest framing
- challenges should remain challenges as a separate growth mechanic
- XP, streaks, milestones, badges, and role/identity become first-class product concepts
- collaboration should feel like squads, allies, shared raids, and group activities rather than plain event participation

## Core Product Identity

PlanQuest should now be described as:

> A gamified productivity and collaboration platform where users manage event quests, take on challenges, earn XP, maintain streaks, and coordinate solo or group progress.

## Product Vocabulary Changes

The mockups imply a vocabulary layer that should be applied consistently across UI and logic.

### Primary User-Facing Terms

- `Event` becomes `Event Quest`
- `Challenge` stays `Challenge`
- `Progress log` becomes `Log Activity`
- `Participants` become `Collaborators`, `Party Members`, `Squad`, or `Allies` depending on context
- `Achievements` stay as achievements, but are more visible and tied to progression
- `Profile` becomes an adventurer identity surface rather than plain account details

### Important Constraint

This should remain mostly a presentation and workflow change first, not an uncontrolled backend rename everywhere.

Recommendation:

- keep stable internal models where possible during transition
- introduce the new language in the frontend and documentation first
- preserve the domain split between planner event quests and challenges
- only rename backend concepts if the existing model boundaries become misleading or blocking

## Route Intent Changes

The six mockups imply clearer route identities than the current implementation.

## Dashboard

The dashboard becomes:

- the command center
- the place where the user sees daily focus, streak state, XP, deadlines, and performance summary

### Logic Implications

- dashboard should aggregate today and upcoming views, not just dump raw domain lists
- items need priority/rarity/type labels such as:
  - main quest
  - side quest
  - achievement
  - legendary
- dashboard cards need status states such as:
  - active
  - optional
  - critical
- dashboard metrics need explicit computation:
  - current streak
  - quests done total
  - total XP
  - focus items for today
- deadlines should be rendered as a distinct side widget, not mixed into the main event-quest feed

## Challenges Route Becomes Challenge Hub

The mockups show the current challenges area evolving into:

- a challenge hub
- active challenge cards with stronger progress visuals
- a prominent CTA to create a new challenge
- milestone and reward summary on the right rail

### Logic Implications

- challenge cards should support richer metadata:
  - category label
  - status
  - current streak or progress measure
  - log activity CTA
- the route should distinguish:
  - active challenges
  - archived/completed challenges later
- milestone stats need explicit logic sources:
  - completed challenge counts or challenge wins, depending on final terminology
  - total XP earned
  - best streak
- recent loot implies a reward history model or at least a recent achievements/reward feed

The route can still use adventurous presentation language, but it should not erase the challenge concept.

## Planner Route Becomes Quest Planner

The mockup shows the planner as:

- a hybrid planning board
- a calendar/list route
- a place to create event quests
- a place to manage collaborators for group event quests

### Logic Implications

- planner events should support both:
  - solo mode
  - group mode
- collaboration input is now embedded directly in event-quest creation
- a planner event quest needs:
  - title
  - date
  - time
  - category / mode
  - collaborators
- calendar cells show scheduled event-quest presence visually
- planner cards show different behavior for:
  - group raid / shared event quest
  - solo quest / self progress

This is stronger than the current event CRUD model and means the planner route should no longer feel like plain event management.

## Profile Route Becomes Identity + Progress Surface

The profile mockups change profile from plain account editing into:

- player identity
- XP progression
- public-facing adventurer profile
- achievement shelf
- active squad / allies area
- settings and privacy controls

### Logic Implications

- profile must combine:
  - editable account identity
  - progression summary
  - social visibility settings
  - squad/member surfaces
- profile editing now includes product-facing preferences, not just backend user fields

That introduces likely new settings categories:

- notification preferences
- privacy preferences
- leaderboard visibility
- DM / mention preferences

These do not all exist in the backend today.

## Create Challenge Flow Becomes Dedicated Page

The mockups clearly show a separate create-challenge screen instead of only inline creation inside the challenge list.

### Logic Implications

- challenge creation should move from inline widget to dedicated route/form
- creation form needs richer inputs:
  - challenge title
  - lore/objectives description
  - streak goal in days
  - optional final deadline
  - category tags
  - challenge mode
  - reward/XP preview
- challenge mode is explicit UI:
  - solo
  - group later if and when supported

This is a material workflow shift and should be treated as such in future architecture updates.

## Domain Logic Changes Needed

The mockups do not just change styling. They require explicit logic changes.

## 1. Progression System Must Become First-Class

Currently, achievements exist, but XP/level/streak presentation is not yet a dominant domain layer.

To match the mockups, the app needs explicit progression rules for:

- XP accumulation
- level thresholds
- streak counting
- reward preview
- milestone summaries

Questions the logic must answer:

- which actions grant XP?
- how much XP does each event-quest or challenge action grant?
- are XP values static, category-based, rarity-based, or completion-based?
- does logging activity grant XP, or only completion?
- are streaks per challenge, per account, per event-quest, or some combination?
- how are levels computed from XP?

Recommendation:

- make account-level XP and level first-class
- keep per-challenge progress separate from account progression
- keep event-quest scheduling/progress separate from challenge progress
- define a deterministic XP table before implementation

## 2. Event Quest And Challenge Taxonomy Must Be Formalized

The dashboard mockups use labels like:

- main quest
- side quest
- achievement
- legendary

This means the product now needs a clearer classification system, not just freeform challenge/event categories.

Possible model directions:

- `activity_type`
  - event_quest
  - challenge
  - achievement_display_item
- `activity_role`
  - main
  - side
  - optional
- `reward_tier`
  - common
  - high_xp
  - legendary

Recommendation:

- do not overload one field with all these meanings
- do not force event quests and challenges into one internal object unless that later proves necessary
- treat kind, priority, and reward tier as separate conceptual concerns even if implementation starts smaller

## 3. Solo And Group Modes Need Real Product Rules

The planner mockup clearly implies solo/group distinctions. The challenge mockups currently support solo-first growth loops and can add group behavior later if intentionally designed.

Current reality:

- planner collaboration exists in a limited invitation/event-participant model
- challenge creation is still effectively self-only

Needed decisions:

- when is an event quest solo vs group?
- for group event quests, who creates it?
- who can invite collaborators?
- who can log activity?
- is completion individual, shared, or hybrid?
- are group event-quest rewards granted equally or separately?

Recommendation:

- formalize solo/group mode for planner event quests first
- keep challenges solo-first until group challenge rules are explicitly designed

## 4. Social Layer Becomes More Real

The profile and planner mockups imply:

- active squad
- friends/allies
- invite new ally
- collaborator chips
- social mentions / DMs settings

This is beyond the current backend.

Needed logic decisions:

- do we introduce a true friendship / ally system?
- or do we keep social identity lightweight through existing invitation/collaboration surfaces first?

Recommendation:

- do not build a full social graph yet
- introduce ally/squad as a thin layer over collaboration and profile visibility first
- defer real friend requests, DMs, and mentions until explicitly planned

## 5. Notification Logic Needs Expansion

The edit profile mockup includes:

- challenge invitations
- achievement alerts
- social mentions

This means notification preferences need data backing.

Current state:

- there is no full notification system

Needed later:

- preference storage
- trigger matrix
- eventual delivery channel choice

Recommendation:

- add preference data shape before building full notification delivery
- do not fake live notifications as complete functionality

## UI Behavior Changes Needed

## Dashboard Behavior

- default to a curated today experience, not a raw overview dump
- support daily/weekly/global filters for aggregate stats
- show deadline urgency distinctly
- show XP values on actionable cards
- surface card type and state visually and semantically

## Challenge Hub Behavior

- challenge cards need a stronger call to log activity
- create-challenge CTA should navigate to a dedicated create route
- milestones and reward summaries should live in a supporting side rail

## Planner Behavior

- support calendar view and list view
- support richer event-quest creation in-page or via a dedicated panel
- collaborator chips must be removable before submit
- group/solo toggle changes available inputs and validation

## Profile Behavior

- separate view profile and edit profile experiences more clearly
- show progression summary as a permanent identity block
- surface achievement shelf as a core part of the route, not a hidden secondary list

## Create Challenge Behavior

- this should become a full workflow page, not a mini form embedded in the list
- reward preview should react to challenge inputs once logic is defined
- manifest quest can remain presentation copy, but it should submit a challenge creation flow

## Data Model Pressure Points

These mockups put pressure on specific backend areas.

## Existing Areas That Likely Need Expansion

- `accounts`
  - public profile metadata
  - avatar/edit profile UX parity
  - preferences
  - progression summary fields or derived services
- `planner`
  - event-quest presentation
  - collaborator chips / group mode handling
  - richer event categorization
- `challenges`
  - challenge-specific progression metadata
  - streak goal field
  - richer reward / XP attributes
- `achievements`
  - closer coupling to visible progression and reward history

## Likely New Concepts

- XP ledger or XP service
- level progression rules
- milestone summary service
- notification preferences model
- reward preview logic
- ally/squad presentation layer

## Recommended Logic Priorities

To move toward these mockups without exploding scope, the next logic priorities should be:

1. Define progression rules
   - XP, level, streak, milestone calculations
2. Define event-quest and challenge vocabulary and taxonomy
   - what is an event quest versus a challenge internally and in UI
3. Upgrade challenge creation flow
   - dedicated page, richer form inputs, challenge-specific language
4. Upgrade planner creation flow
   - solo/group event-quest behavior
5. Define lightweight social layer rules
   - ally/squad visibility without full social network overreach
6. Define preference model
   - notifications, privacy, leaderboard/public profile controls

## Recommended Document Follow-Ups

After this memo, the following existing docs should be updated from it:

- `docs/architecture/planquest-product-direction.md`
- `docs/architecture/planquest-user-journeys.md`
- `docs/architecture/planquest-domain-rules.md`

And a future implementation plan should likely split the work into:

- gamified domain model and progression logic
- challenge hub + create challenge flow
- planner event-quest UI + group planner logic
- profile/social/preferences layer

## Strict Recommendation

The mockups are strong, but they imply a broader product than the current docs now describe.

So the safe interpretation is:

- the UI direction is valid
- the product direction has shifted toward gamified growth productivity
- planner items should be reframed as event quests
- challenges should remain challenges
- the logic and domain rules must be updated deliberately before broad implementation

This should be treated as a controlled product-direction change, not just a frontend redesign.
