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

