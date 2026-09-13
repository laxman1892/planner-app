from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from apps.challenges.services import active_challenges_for_reminders
from apps.planner.models import Event, EventParticipant

from .models import Notification, NotificationDelivery, NotificationPreference

EVENT_WINDOWS = (
    ("24h", timedelta(hours=24)),
    ("1h", timedelta(hours=1)),
    ("5m", timedelta(minutes=5)),
)


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


def _notification_exists(*, user, type, payload_key, payload_id, window):
    return Notification.objects.filter(
        user=user,
        type=type,
        **{
            f"payload__{payload_key}": payload_id,
            "payload__window": window,
        },
    ).exists()


def _generate_due_event_reminders(now):
    for window, delta in EVENT_WINDOWS:
        target_time = now + delta
        lower_bound = target_time - timedelta(minutes=1)
        upper_bound = target_time + timedelta(minutes=1)
        events = Event.objects.filter(
            is_completed=False,
            starts_at__gte=lower_bound,
            starts_at__lt=upper_bound,
        ).prefetch_related("participants__user")

        for event in events:
            recipients = [event.creator]
            recipients.extend(
                invitation.user
                for invitation in event.participants.all()
                if invitation.status == EventParticipant.Status.ACCEPTED
            )

            for user in recipients:
                if _notification_exists(
                    user=user,
                    type="event_reminder",
                    payload_key="event_id",
                    payload_id=event.id,
                    window=window,
                ):
                    continue

                preferences = get_or_create_preferences(user)
                create_reminder_notification(
                    user=user,
                    type="event_reminder",
                    title="Event quest reminder",
                    body=f"{event.title} starts soon.",
                    payload={"event_id": event.id, "window": window},
                    email_enabled=preferences.event_reminder_email,
                    in_app_enabled=preferences.event_reminder_in_app,
                )


def _generate_due_challenge_reminders(now):
    for challenge in active_challenges_for_reminders():
        if _notification_exists(
            user=challenge.creator,
            type="challenge_reminder",
            payload_key="challenge_id",
            payload_id=challenge.id,
            window="daily",
        ):
            continue

        preferences = get_or_create_preferences(challenge.creator)
        create_reminder_notification(
            user=challenge.creator,
            type="challenge_reminder",
            title="Challenge reminder",
            body=f"Keep making progress on {challenge.title}.",
            payload={"challenge_id": challenge.id, "window": "daily"},
            email_enabled=preferences.challenge_reminder_email,
            in_app_enabled=preferences.challenge_reminder_in_app,
        )


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
