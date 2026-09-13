# Notifications And Reminders

## Purpose

This document records the current notification and reminder contract for the renewed PlanQuest direction.

## Notification Types

- `invite_sent`
- `invite_accepted`
- `invite_declined`
- `event_reminder`
- `challenge_reminder`

## Delivery Model

- Every notification is stored as a `Notification` record first.
- Delivery channels are stored separately in `NotificationDelivery`.
- Supported channels in this phase:
  - `in_app`
  - `email`
- In-app delivery is the source-of-truth surface.
- Email is a delivery channel, not a separate notification source.

## Preference Model

Per-user preferences currently support:

- `invite_email`
- `invite_in_app`
- `event_reminder_email`
- `event_reminder_in_app`
- `challenge_reminder_email`
- `challenge_reminder_in_app`

Preferences can disable one channel without disabling the other.

## Collaboration Notification Rules

- When an event quest invitation is created, the invitee receives:
  - an in-app notification if `invite_in_app` is enabled
  - an email notification if `invite_email` is enabled
- When an invitation is accepted, the event-quest creator receives the same channel behavior.
- When an invitation is declined, the event-quest creator receives the same channel behavior.

## Reminder Windows

Event quest reminders fire at:

- `24 hours` before start
- `1 hour` before start
- `5 minutes` before start

Challenge reminders currently use one simple window:

- `daily`

## Reminder Recipients

Event quest reminders go to:

- the creator
- accepted participants

Event quest reminders do not go to:

- pending invitees
- declined invitees
- expired invitees

Challenge reminders currently go to:

- the challenge creator only

## Reminder Stop Conditions

- completed event quests do not generate future reminders
- completed challenges do not generate future reminders
- past event quests do not generate future reminders

## Scheduler Command

Use:

```bash
cd backend
.venv\Scripts\python.exe manage.py run_notification_jobs
```

This command:

- generates due reminders
- sends pending email deliveries

## Local Email Behavior

Default local behavior uses Django's console email backend unless overridden by environment variables.

Relevant settings:

- `EMAIL_BACKEND`
- `DEFAULT_FROM_EMAIL`
- `NOTIFICATION_EMAIL_RETRY_LIMIT`

## Deferred Items

- websockets or live push
- SMS or mobile push
- rich template management
- queue workers
- per-window reminder preferences
- collaborative challenge reminder rules beyond creator-only delivery
