# PlanQuest Notifications And Reminders Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a real notification system that supports in-app notifications, email delivery, and scheduled reminders for event quests and challenges.

**Architecture:** Keep this boring. Add one backend `notifications` app that owns notification records, email delivery records, user preferences, and reminder generation. Domain apps such as `planner` and `challenges` only emit notification events through notification services; they do not send emails directly. Use a Django management command for scheduled reminder generation and retryable email delivery instead of introducing Celery.

**Tech Stack:** Django 5, Django REST Framework, SQLite for local development, Django email backend, Next.js 15 App Router, React 19, Node test runner, ESLint

---

## Scope

This plan covers:

- in-app notifications
- email notifications
- event invitation emails
- invitation accepted/declined emails
- event reminder emails and in-app reminders
- challenge reminder emails and in-app reminders
- notification preferences
- notification read state

This plan intentionally does not cover:

- websockets
- push notifications
- SMS
- RTC
- Celery or background queue infrastructure
- rich notification templating system
- group challenge collaboration rules beyond reminder delivery to the current owner

## Product Rules Locked By This Plan

- Collaboration notifications use both in-app and email channels.
- Reminder notifications use both in-app and email channels.
- Event reminders fire at `24 hours`, `1 hour`, and `5 minutes` before `starts_at`.
- Event reminders go to the creator and accepted participants only.
- Pending, declined, and expired invitees do not receive event reminders.
- Challenge reminders go to the challenge creator only for now.
- Completed events and completed challenges stop future reminders.
- Email is a delivery channel, not the source of truth. Every email-worthy notification must exist as a persisted notification record.

## File Structure Strategy

### Backend

- Create `backend/apps/notifications/apps.py`
  - register the new app
- Create `backend/apps/notifications/models.py`
  - `Notification`
  - `NotificationDelivery`
  - `NotificationPreference`
- Create `backend/apps/notifications/admin.py`
  - basic admin registration for inspection
- Create `backend/apps/notifications/serializers.py`
  - list and update serializers for notifications and preferences
- Create `backend/apps/notifications/services.py`
  - record creation
  - delivery creation
  - reminder generation
  - email send logic
- Create `backend/apps/notifications/views.py`
  - notification list/read endpoints
  - preference get/update endpoint
- Create `backend/apps/notifications/management/commands/run_notification_jobs.py`
  - generate due reminders and send pending emails
- Create `backend/apps/notifications/tests/test_notification_api.py`
  - in-app list/read state tests
- Create `backend/apps/notifications/tests/test_notification_delivery.py`
  - email delivery and retry tests
- Create `backend/apps/notifications/tests/test_reminder_generation.py`
  - event and challenge reminder generation tests
- Modify `backend/config/settings.py`
  - install app
  - add email config and reminder settings
- Modify `backend/config/urls.py`
  - add notification routes
- Modify `backend/apps/planner/services.py`
  - emit invite sent / accepted / declined notifications
- Modify `backend/apps/planner/models.py`
  - add minimal completion flag for events so reminders can stop
- Modify `backend/apps/planner/serializers.py`
  - expose event completion state if needed
- Modify `backend/apps/planner/tests/test_event_invitations.py`
  - verify notification side effects
- Modify `backend/apps/challenges/tests` as needed
  - verify challenge reminder generation assumptions

### Frontend

- Create `frontend/components/notifications/NotificationBell.jsx`
  - topbar button with unread count
- Create `frontend/components/notifications/NotificationCenter.jsx`
  - inbox list with mark-as-read actions
- Create `frontend/components/notifications/NotificationPreferencesForm.jsx`
  - profile-facing preference toggles
- Create `frontend/lib/notifications.js`
  - small pure helpers for unread count and item labels
- Create `frontend/lib/notifications.test.js`
  - helper tests
- Modify `frontend/lib/api.js`
  - notification list/update endpoints
  - preference get/update endpoints
- Modify `frontend/components/layout/Topbar.jsx`
  - add bell/button
- Modify `frontend/components/dashboard/ProfilePage.jsx`
  - load and render notification preferences
- Modify `frontend/components/dashboard/DashboardPageShell.jsx`
  - host notification center state if this is the smallest seam
- Modify `frontend/app/(dashboard)/layout.jsx`
  - wire notification data loading if needed

### Docs

- Create `docs/architecture/notifications-and-reminders.md`
  - final contract and operating model
- Modify `docs/architecture/planquest-domain-rules.md`
  - align notification and reminder rules
- Modify `README.md`
  - local email/reminder setup notes

## Task 1: Add Notification Domain Models And API

**Files:**
- Create: `backend/apps/notifications/apps.py`
- Create: `backend/apps/notifications/models.py`
- Create: `backend/apps/notifications/serializers.py`
- Create: `backend/apps/notifications/views.py`
- Create: `backend/apps/notifications/tests/test_notification_api.py`
- Modify: `backend/config/settings.py`
- Modify: `backend/config/urls.py`

- [ ] **Step 1: Write the failing notification API tests**

```python
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.notifications.models import Notification, NotificationPreference

User = get_user_model()


class NotificationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="hero",
            email="hero@example.com",
            password="strongpass123",
        )
        token_response = self.client.post(
            "/api/auth/token/",
            {"email": "hero@example.com", "password": "strongpass123"},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_response.data['access']}")

    def test_user_can_list_their_notifications(self):
        Notification.objects.create(
            user=self.user,
            type="invite_sent",
            title="Invitation sent",
            body="You invited a user.",
        )

        response = self.client.get("/api/notifications/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_user_can_mark_notification_read(self):
        notification = Notification.objects.create(
            user=self.user,
            type="invite_sent",
            title="Invitation sent",
            body="You invited a user.",
        )

        response = self.client.patch(
            f"/api/notifications/{notification.id}/",
            {"is_read": True},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notification.refresh_from_db()
        self.assertIsNotNone(notification.read_at)

    def test_user_can_get_and_update_preferences(self):
        response = self.client.get("/api/notification-preferences/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        update = self.client.patch(
            "/api/notification-preferences/me/",
            {"event_reminder_email": False},
            format="json",
        )

        self.assertEqual(update.status_code, status.HTTP_200_OK)
        self.assertFalse(update.data["event_reminder_email"])
```

- [ ] **Step 2: Run the backend notification API tests to verify failure**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.notifications.tests.test_notification_api
```

Expected:

- import or route failure because the notifications app and endpoints do not exist yet

- [ ] **Step 3: Add the minimal notification models**

Use this shape in `backend/apps/notifications/models.py`:

```python
from django.conf import settings
from django.db import models
from django.utils import timezone


class Notification(models.Model):
    class Type(models.TextChoices):
        INVITE_SENT = "invite_sent", "Invite Sent"
        INVITE_ACCEPTED = "invite_accepted", "Invite Accepted"
        INVITE_DECLINED = "invite_declined", "Invite Declined"
        EVENT_REMINDER = "event_reminder", "Event Reminder"
        CHALLENGE_REMINDER = "challenge_reminder", "Challenge Reminder"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=40, choices=Type.choices)
    title = models.CharField(max_length=200)
    body = models.TextField()
    payload = models.JSONField(default=dict, blank=True)
    read_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    @property
    def is_read(self):
        return self.read_at is not None

    def mark_read(self):
        if self.read_at is None:
            self.read_at = timezone.now()
            self.save(update_fields=["read_at"])


class NotificationDelivery(models.Model):
    class Channel(models.TextChoices):
        IN_APP = "in_app", "In-App"
        EMAIL = "email", "Email"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name="deliveries")
    channel = models.CharField(max_length=20, choices=Channel.choices)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    attempts = models.PositiveIntegerField(default=0)
    sent_at = models.DateTimeField(blank=True, null=True)
    last_error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class NotificationPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notification_preferences")
    invite_email = models.BooleanField(default=True)
    invite_in_app = models.BooleanField(default=True)
    event_reminder_email = models.BooleanField(default=True)
    event_reminder_in_app = models.BooleanField(default=True)
    challenge_reminder_email = models.BooleanField(default=True)
    challenge_reminder_in_app = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)
```

- [ ] **Step 4: Add the smallest API surface**

Implement:

- `/api/notifications/`
  - `GET` current user's notifications
- `/api/notifications/<id>/`
  - `PATCH {"is_read": true}`
- `/api/notification-preferences/me/`
  - `GET`
  - `PATCH`

Use `ModelViewSet` only for notifications if that is smaller than separate generics; otherwise use generic views. Keep write access narrow.

- [ ] **Step 5: Register app and routes**

Modify `backend/config/settings.py`:

```python
INSTALLED_APPS = [
    ...
    "apps.notifications",
]
```

Modify `backend/config/urls.py`:

```python
from apps.notifications.views import NotificationPreferenceView, NotificationViewSet

router.register("notifications", NotificationViewSet, basename="notification")

urlpatterns = [
    ...
    path("api/notification-preferences/me/", NotificationPreferenceView.as_view(), name="notification-preferences"),
    path("api/", include(router.urls)),
]
```

- [ ] **Step 6: Run the backend notification API tests again**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.notifications.tests.test_notification_api
```

Expected:

- PASS

- [ ] **Step 7: Commit**

```bash
git add backend/apps/notifications backend/config/settings.py backend/config/urls.py
git commit -m "Add notification models and API"
```

## Task 2: Emit Collaboration Notifications From Planner Flows

**Files:**
- Modify: `backend/apps/planner/services.py`
- Modify: `backend/apps/planner/views.py`
- Modify: `backend/apps/planner/tests/test_event_invitations.py`
- Modify: `backend/apps/notifications/services.py`

- [ ] **Step 1: Add failing tests for collaboration notification side effects**

Add these tests to `backend/apps/planner/tests/test_event_invitations.py`:

```python
from apps.notifications.models import Notification, NotificationDelivery

def test_create_invitation_creates_notification_for_invitee(self):
    response = self.client.post(
        "/api/event-invitations/",
        {"event": self.event.id, "identifier": self.invited_user.email},
        format="json",
    )

    self.assertEqual(response.status_code, 201)
    notification = Notification.objects.get(user=self.invited_user, type="invite_sent")
    self.assertEqual(notification.deliveries.filter(channel="email").count(), 1)

def test_accepting_invitation_creates_notification_for_creator(self):
    self.invitation.status = "pending"
    self.invitation.save(update_fields=["status"])
    self.client.force_authenticate(user=self.invited_user)

    response = self.client.patch(
        f"/api/event-invitations/{self.invitation.id}/",
        {"status": "accepted"},
        format="json",
    )

    self.assertEqual(response.status_code, 200)
    self.assertTrue(
        Notification.objects.filter(user=self.creator, type="invite_accepted").exists()
    )

def test_declining_invitation_creates_notification_for_creator(self):
    self.invitation.status = "pending"
    self.invitation.save(update_fields=["status"])
    self.client.force_authenticate(user=self.invited_user)

    response = self.client.patch(
        f"/api/event-invitations/{self.invitation.id}/",
        {"status": "declined"},
        format="json",
    )

    self.assertEqual(response.status_code, 200)
    self.assertTrue(
        Notification.objects.filter(user=self.creator, type="invite_declined").exists()
    )
```

- [ ] **Step 2: Run invitation tests to verify failure**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.planner.tests.test_event_invitations
```

Expected:

- FAIL because no notification emission exists yet

- [ ] **Step 3: Add one notification creation service**

Add helpers to `backend/apps/notifications/services.py`:

```python
from apps.notifications.models import Notification, NotificationDelivery, NotificationPreference


def get_or_create_preferences(user):
    preferences, _ = NotificationPreference.objects.get_or_create(user=user)
    return preferences


def create_notification(*, user, type, title, body, payload=None, include_email=False, include_in_app=True):
    notification = Notification.objects.create(
        user=user,
        type=type,
        title=title,
        body=body,
        payload=payload or {},
    )

    if include_in_app:
        NotificationDelivery.objects.create(
            notification=notification,
            channel=NotificationDelivery.Channel.IN_APP,
            status=NotificationDelivery.Status.SENT,
        )

    if include_email:
        NotificationDelivery.objects.create(
            notification=notification,
            channel=NotificationDelivery.Channel.EMAIL,
        )

    return notification
```

- [ ] **Step 4: Wire planner invitation flows to emit notifications**

Call the notification service from the existing planner invitation creation/update flows:

- invite created -> notify invitee with `invite_sent`
- invite accepted -> notify creator with `invite_accepted`
- invite declined -> notify creator with `invite_declined`

Pass payload keys that future UI can use:

```python
{
    "event_id": invitation.event_id,
    "event_title": invitation.event.title,
    "actor_email": invitation.user.email,
}
```

- [ ] **Step 5: Respect user preferences when creating channels**

Before creating email or in-app deliveries, load preferences and gate:

- invite email -> `invite_email`
- invite in-app -> `invite_in_app`

Do not skip the notification row itself; skip only the delivery channels.

- [ ] **Step 6: Run invitation tests again**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.planner.tests.test_event_invitations
```

Expected:

- PASS

- [ ] **Step 7: Commit**

```bash
git add backend/apps/planner/services.py backend/apps/planner/views.py backend/apps/planner/tests/test_event_invitations.py backend/apps/notifications/services.py
git commit -m "Emit collaboration notifications from invitations"
```

## Task 3: Add Event Completion And Reminder Generation

**Files:**
- Modify: `backend/apps/planner/models.py`
- Modify: `backend/apps/planner/serializers.py`
- Create: `backend/apps/notifications/tests/test_reminder_generation.py`
- Modify: `backend/apps/notifications/services.py`

- [ ] **Step 1: Add failing reminder generation tests**

Create `backend/apps/notifications/tests/test_reminder_generation.py` with:

```python
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from apps.challenges.models import Challenge
from apps.notifications.models import Notification
from apps.notifications.services import generate_due_reminders
from apps.planner.models import Event, EventParticipant

User = get_user_model()


class ReminderGenerationTests(TestCase):
    def setUp(self):
        self.creator = User.objects.create_user(
            username="creator",
            email="creator@example.com",
            password="strongpass123",
        )
        self.invitee = User.objects.create_user(
            username="invitee",
            email="invitee@example.com",
            password="strongpass123",
        )

    def test_event_reminder_created_for_creator_and_accepted_participant(self):
        event = Event.objects.create(
            creator=self.creator,
            title="Planning sync",
            starts_at=timezone.now() + timedelta(hours=1),
            category="work",
        )
        EventParticipant.objects.create(
            event=event,
            user=self.invitee,
            status=EventParticipant.Status.ACCEPTED,
        )

        generate_due_reminders(now=timezone.now())

        self.assertEqual(
            Notification.objects.filter(type="event_reminder", payload__event_id=event.id).count(),
            2,
        )

    def test_event_reminder_not_created_for_completed_event(self):
        event = Event.objects.create(
            creator=self.creator,
            title="Done already",
            starts_at=timezone.now() + timedelta(minutes=5),
            category="work",
            is_completed=True,
        )

        generate_due_reminders(now=timezone.now())

        self.assertFalse(Notification.objects.filter(payload__event_id=event.id).exists())

    def test_challenge_reminder_created_for_active_challenge_owner(self):
        challenge = Challenge.objects.create(
            creator=self.creator,
            title="Daily writing",
        )

        generate_due_reminders(now=timezone.now())

        self.assertTrue(
            Notification.objects.filter(type="challenge_reminder", payload__challenge_id=challenge.id).exists()
        )
```

- [ ] **Step 2: Run reminder generation tests to verify failure**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.notifications.tests.test_reminder_generation
```

Expected:

- FAIL because events do not have completion state and reminder generation does not exist

- [ ] **Step 3: Add the smallest event completion state**

Modify `backend/apps/planner/models.py`:

```python
class Event(models.Model):
    ...
    is_completed = models.BooleanField(default=False)
```

Expose it in the event serializer and allow owner-only updates. Do not auto-delete completed events. Deletion removes history; completion is the smaller useful rule for reminders.

- [ ] **Step 4: Implement due reminder generation**

Add this shape to `backend/apps/notifications/services.py`:

```python
from datetime import timedelta
from django.utils import timezone

EVENT_WINDOWS = (
    ("24h", timedelta(hours=24)),
    ("1h", timedelta(hours=1)),
    ("5m", timedelta(minutes=5)),
)


def create_reminder_notification(*, user, type, title, body, payload, email_enabled, in_app_enabled):
    return create_notification(
        user=user,
        type=type,
        title=title,
        body=body,
        payload=payload,
        include_email=email_enabled,
        include_in_app=in_app_enabled,
    )


def generate_due_reminders(now=None):
    now = now or timezone.now()
    _generate_due_event_reminders(now)
    _generate_due_challenge_reminders(now)
```

Rules to implement:

- event reminders at `24h`, `1h`, `5m`
- creator plus accepted participants only
- skip completed events
- skip past events
- challenge reminders for active self-challenges only
- create at most one notification per user per item per window

Use `payload` keys:

```python
{
    "event_id": event.id,
    "window": "1h",
}
```

and

```python
{
    "challenge_id": challenge.id,
    "window": "daily",
}
```

- [ ] **Step 5: Re-run reminder tests**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.notifications.tests.test_reminder_generation
```

Expected:

- PASS

- [ ] **Step 6: Commit**

```bash
git add backend/apps/planner/models.py backend/apps/planner/serializers.py backend/apps/notifications/services.py backend/apps/notifications/tests/test_reminder_generation.py
git commit -m "Add event completion and reminder generation"
```

## Task 4: Add Email Delivery And Retry Job

**Files:**
- Create: `backend/apps/notifications/management/commands/run_notification_jobs.py`
- Create: `backend/apps/notifications/tests/test_notification_delivery.py`
- Modify: `backend/apps/notifications/services.py`
- Modify: `backend/config/settings.py`

- [ ] **Step 1: Add failing email delivery tests**

Create `backend/apps/notifications/tests/test_notification_delivery.py`:

```python
from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings

from apps.notifications.models import NotificationDelivery
from apps.notifications.services import create_notification, deliver_pending_notifications

User = get_user_model()


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class NotificationDeliveryTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="hero",
            email="hero@example.com",
            password="strongpass123",
        )

    def test_pending_email_delivery_is_sent(self):
        notification = create_notification(
            user=self.user,
            type="invite_sent",
            title="Invitation sent",
            body="You have a new invitation.",
            include_email=True,
            include_in_app=False,
        )

        deliver_pending_notifications()

        delivery = notification.deliveries.get(channel="email")
        self.assertEqual(delivery.status, NotificationDelivery.Status.SENT)
        self.assertEqual(len(mail.outbox), 1)

    def test_failed_email_delivery_is_marked_failed(self):
        notification = create_notification(
            user=self.user,
            type="invite_sent",
            title="Invitation sent",
            body="You have a new invitation.",
            include_email=True,
            include_in_app=False,
        )

        delivery = notification.deliveries.get(channel="email")
        self.assertEqual(delivery.status, NotificationDelivery.Status.PENDING)
```

- [ ] **Step 2: Run delivery tests to verify failure**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.notifications.tests.test_notification_delivery
```

Expected:

- FAIL because delivery processing does not exist

- [ ] **Step 3: Add email settings with safe defaults**

Add to `backend/config/settings.py`:

```python
EMAIL_BACKEND = os.getenv("EMAIL_BACKEND", "django.core.mail.backends.console.EmailBackend")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "no-reply@planquest.local")
NOTIFICATION_EMAIL_RETRY_LIMIT = int(os.getenv("NOTIFICATION_EMAIL_RETRY_LIMIT", "3"))
```

- [ ] **Step 4: Implement delivery processing**

Add to `backend/apps/notifications/services.py`:

```python
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone


def deliver_pending_notifications():
    pending = NotificationDelivery.objects.filter(
        channel=NotificationDelivery.Channel.EMAIL,
        status=NotificationDelivery.Status.PENDING,
    ).select_related("notification__user")

    for delivery in pending:
        try:
            send_mail(
                subject=delivery.notification.title,
                message=delivery.notification.body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[delivery.notification.user.email],
                fail_silently=False,
            )
            delivery.status = NotificationDelivery.Status.SENT
            delivery.sent_at = timezone.now()
            delivery.last_error = ""
        except Exception as exc:
            delivery.status = NotificationDelivery.Status.FAILED
            delivery.last_error = str(exc)
        finally:
            delivery.attempts += 1
            delivery.save(update_fields=["status", "sent_at", "last_error", "attempts"])
```

This is enough for now. Retry means the command may requeue failed rows below the limit; do not build a separate worker system.

- [ ] **Step 5: Add the single scheduler command**

Create `backend/apps/notifications/management/commands/run_notification_jobs.py`:

```python
from django.core.management.base import BaseCommand

from apps.notifications.services import deliver_pending_notifications, generate_due_reminders


class Command(BaseCommand):
    help = "Generate due reminders and send pending notification emails."

    def handle(self, *args, **options):
        generate_due_reminders()
        deliver_pending_notifications()
        self.stdout.write(self.style.SUCCESS("Notification jobs complete."))
```

- [ ] **Step 6: Re-run delivery tests**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.notifications.tests.test_notification_delivery
```

Expected:

- PASS

- [ ] **Step 7: Commit**

```bash
git add backend/apps/notifications/management backend/apps/notifications/tests/test_notification_delivery.py backend/apps/notifications/services.py backend/config/settings.py
git commit -m "Add email notification delivery job"
```

## Task 5: Add Frontend Notification Center And Bell

**Files:**
- Create: `frontend/components/notifications/NotificationBell.jsx`
- Create: `frontend/components/notifications/NotificationCenter.jsx`
- Create: `frontend/lib/notifications.js`
- Create: `frontend/lib/notifications.test.js`
- Modify: `frontend/lib/api.js`
- Modify: `frontend/components/layout/Topbar.jsx`
- Modify: `frontend/components/dashboard/DashboardPageShell.jsx`

- [ ] **Step 1: Add the smallest frontend helper tests**

Create `frontend/lib/notifications.test.js`:

```js
import assert from "node:assert/strict";
import test from "node:test";

import { getUnreadCount, getNotificationLabel } from "./notifications.js";

test("getUnreadCount counts unread notifications", () => {
  assert.equal(
    getUnreadCount([
      { id: 1, is_read: false },
      { id: 2, is_read: true },
      { id: 3, is_read: false },
    ]),
    2,
  );
});

test("getNotificationLabel maps reminder types", () => {
  assert.equal(getNotificationLabel({ type: "event_reminder" }), "Event reminder");
});
```

- [ ] **Step 2: Add notification API helpers**

Extend `frontend/lib/api.js` with:

```js
export function listNotifications(accessToken) {
  return authenticatedRequest("/notifications/", accessToken);
}

export function markNotificationRead(notificationId, accessToken) {
  return authenticatedRequest(`/notifications/${notificationId}/`, accessToken, {
    method: "PATCH",
    body: JSON.stringify({ is_read: true }),
  });
}
```

- [ ] **Step 3: Create the minimal UI components**

Keep them simple:

- `NotificationBell.jsx`
  - button
  - unread count badge
  - toggle callback
- `NotificationCenter.jsx`
  - list notifications
  - mark-as-read action
  - empty state

Render each item with:

- title
- body
- created timestamp
- unread/read styling

- [ ] **Step 4: Wire the bell into the topbar**

Use `frontend/components/layout/Topbar.jsx` as the seam. Do not add a whole notifications page unless the existing topbar/panel pattern becomes awkward.

- [ ] **Step 5: Load notifications in the dashboard shell**

Store:

- `notifications`
- `isNotificationsLoading`
- `notificationsError`
- `isNotificationCenterOpen`

in the smallest existing dashboard-level state owner. If `DashboardPageShell.jsx` already owns shared page state, keep it there.

- [ ] **Step 6: Run frontend tests**

Run:

```bash
cd frontend
npm test
```

Expected:

- PASS including the new notification helper test

- [ ] **Step 7: Commit**

```bash
git add frontend/components/notifications frontend/lib/api.js frontend/lib/notifications.js frontend/lib/notifications.test.js frontend/components/layout/Topbar.jsx frontend/components/dashboard/DashboardPageShell.jsx frontend/package.json
git commit -m "Add in-app notification center"
```

## Task 6: Add Notification Preferences To Profile

**Files:**
- Create: `frontend/components/notifications/NotificationPreferencesForm.jsx`
- Modify: `frontend/lib/api.js`
- Modify: `frontend/components/dashboard/ProfilePage.jsx`

- [ ] **Step 1: Add preference API helpers**

Extend `frontend/lib/api.js` with:

```js
export function getNotificationPreferences(accessToken) {
  return authenticatedRequest("/notification-preferences/me/", accessToken);
}

export function updateNotificationPreferences(accessToken, payload) {
  return authenticatedRequest("/notification-preferences/me/", accessToken, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
```

- [ ] **Step 2: Build the smallest useful preferences form**

Show toggles for:

- invite email
- invite in-app
- event reminder email
- event reminder in-app
- challenge reminder email
- challenge reminder in-app

Do not add per-window reminder preferences yet.

- [ ] **Step 3: Render preferences on the profile page**

Load preferences alongside existing profile data. If `ProfilePage.jsx` already uses `DashboardPageShell`, keep the fetch there instead of adding another app-wide store.

- [ ] **Step 4: Run frontend tests and build**

Run:

```bash
cd frontend
npm test
npm run build
```

Expected:

- PASS

- [ ] **Step 5: Commit**

```bash
git add frontend/components/notifications/NotificationPreferencesForm.jsx frontend/lib/api.js frontend/components/dashboard/ProfilePage.jsx
git commit -m "Add notification preferences to profile"
```

## Task 7: Full Verification And Docs

**Files:**
- Create: `docs/architecture/notifications-and-reminders.md`
- Modify: `docs/architecture/planquest-domain-rules.md`
- Modify: `README.md`

- [ ] **Step 1: Run the backend notification suite**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test apps.notifications.tests.test_notification_api apps.notifications.tests.test_notification_delivery apps.notifications.tests.test_reminder_generation apps.planner.tests.test_event_invitations
```

Expected:

- PASS

- [ ] **Step 2: Run the full backend suite**

Run:

```bash
cd backend
.venv\Scripts\python.exe manage.py test
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

- [ ] **Step 4: Manual verification checklist**

Verify:

- User A invites User B -> User B gets in-app notification and email
- User B accepts -> User A gets in-app notification and email
- User B declines -> User A gets in-app notification and email
- Event at `24h`, `1h`, `5m` windows generates one reminder per user per window
- Accepted participant gets event reminders
- Pending/declined/expired invitee does not get event reminders
- Completed event does not generate later reminders
- Active challenge owner gets challenge reminder
- Notification preferences can disable email while keeping in-app
- Marking a notification read updates unread count

- [ ] **Step 5: Document the final contract**

Write `docs/architecture/notifications-and-reminders.md` with:

- notification types
- delivery channels
- reminder windows
- preference flags
- scheduler command
- deferred items

Update `docs/architecture/planquest-domain-rules.md` with the same notification/reminder policy.

Update `README.md` with local setup notes:

- email backend
- running `manage.py run_notification_jobs`
- expected reminder behavior

- [ ] **Step 6: Commit**

```bash
git add docs/architecture/notifications-and-reminders.md docs/architecture/planquest-domain-rules.md README.md
git commit -m "Document notification and reminder system"
```

## Self-Review

### Spec Coverage

- [ ] collaboration notifications covered
- [ ] email delivery covered
- [ ] in-app notification center covered
- [ ] event reminder timing covered
- [ ] challenge reminders covered
- [ ] read state covered
- [ ] preferences covered

### Placeholder Scan

- [ ] no `TODO`
- [ ] no `TBD`
- [ ] no hidden queue or websocket dependency

### Consistency Check

- [ ] notifications are persisted before delivery
- [ ] reminder windows are `24h`, `1h`, `5m` everywhere
- [ ] event reminders skip non-accepted invitees everywhere
- [ ] challenge reminders remain owner-only everywhere

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-23-planquest-notifications-and-reminders.md`.

Two execution options:

1. Subagent-Driven (recommended) - I dispatch a fresh subagent per task, review between tasks, fast iteration
2. Inline Execution - Execute tasks in this session using executing-plans, batch execution with checkpoints
