# PlanQuest Product Direction

## Product Identity

PlanQuest is a gamified productivity growth system with planner and collaboration support.

The product is no longer best described as planner-first accountability with optional gamification. The renewed direction is a growth-oriented experience where users manage event quests, take on challenges, earn XP, maintain streaks, unlock achievements, and coordinate with collaborators through a game-like productivity loop.

The important product boundary is:

- planner items become `event quests`
- challenges remain `challenges`
- both feed progression, but they are not the same workflow or the same domain concept

## Core Promise

PlanQuest gives users one place to organize event quests, pursue challenges, track visible growth, and stay engaged through progression systems, reminders, and collaboration.

Weekly return reason:

> Users come back each week to manage upcoming event quests, maintain challenge momentum, respond to notifications, and keep progressing their account-level growth.

## Personas

### Primary Persona

`Gamified planner`

- Wants a productivity system that feels more rewarding than a plain task or calendar app.
- Values visible growth, XP, streaks, milestones, and challenge progress.
- Uses planning not just to schedule work, but to sustain motivation.

### Secondary Persona

`Collaborative coordinator`

- Wants to turn an event quest into a shared plan with another person or a small group.
- Cares about invitation state, reminder reliability, and collaborator visibility.
- Is important to the renewed direction because collaboration should feel meaningful, not bolted on.

## Current Product Posture

The renewed direction should be implemented honestly in phases.

What is already real in the codebase:

- JWT auth, registration, and session persistence
- personal event CRUD
- invitation model and invite lifecycle basics
- personal challenge CRUD and logging
- achievements

What the renewal now prioritizes:

- event-quest framing in planner experiences
- challenge hub and dedicated challenge creation
- account-level progression
- notification center and email reminders
- profile as an identity and progress surface
- cleaner route-level UI that matches the mockups

## MVP, Renewal Scope, And Deferred Work

### Renewal MVP

The first renewed slice should center on:

- auth flow with refreshed login and sign-up UI
- command-center dashboard
- planner event quests with collaboration support
- challenge hub with dedicated create flow
- account-level progression summary
- notifications and reminders
- profile progression surface and preferences

### Included In This Renewal

- event quest UI language and workflow
- challenge-specific creation flow and challenge hub
- XP, level, and progression summary groundwork
- invite notifications and event/challenge reminders
- in-app notification center
- profile preferences for notification delivery

### Deferred From This Renewal

- real Google/Facebook OAuth
- full social graph / friend system
- DMs, mentions, and RTC
- collaborative challenges as a finished system
- public leaderboards
- full reward-economy balancing

## Capability Inventory

| Capability | Status | Why |
| --- | --- | --- |
| Registration and login | Core | Backend auth flow is implemented and frontend already supports sign-in/sign-up, though the UI needs renewal. |
| JWT session persistence | Core | Frontend stores and reloads access/refresh tokens. |
| Personal event CRUD | Core | Backend and frontend support owned event creation and management. |
| Event invitations | Supporting | Invitation lifecycle exists, but needs stronger notification and reminder support. |
| Event quest framing | Partial | The underlying event model exists, but the renewed event-quest workflow and UI do not. |
| Self challenges | Core | Backend and frontend support personal challenge creation, logging, and completion. |
| Challenge hub UX | Missing | The current challenge route does not yet match the renewed hub and dedicated create flow. |
| Progression model | Missing | Achievements exist, but there is no account-level XP and level system yet. |
| Notification center | Missing | There is currently no real notification domain or in-app inbox. |
| Email reminders | Missing | Reminder and delivery logic do not yet exist. |
| Profile progression surface | Partial | Basic profile data exists, but the route does not yet reflect growth, squad, and preferences. |
| Squad/allies presentation | Missing | No lightweight collaborator-derived social layer exists yet. |

## Success Metrics

The renewed product should be judged by clarity and cohesion first.

- A new contributor can describe PlanQuest in under 60 seconds as a gamified growth product.
- The docs consistently distinguish event quests from challenges.
- The dashboard, planner, challenges, and profile routes each have a clear product role.
- Notifications and reminders are treated as core retention systems, not optional polish.
- The UI no longer feels like separate features stitched together.

## Product Posture Decision

The renewed product posture is locked as:

> Gamified productivity growth system with planner and collaboration support.

That means:

- event quests belong to the planner domain
- challenges remain challenges
- progression is first-class
- notifications and reminders are essential
- collaboration should feel intentional, but full social systems remain deferred
