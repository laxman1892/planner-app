from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


class Event(models.Model):
    class Category(models.TextChoices):
        PERSONAL = "personal", "Personal"
        WORK = "work", "Work"
        STUDY = "study", "Study"
        HEALTH = "health", "Health"

    class QuestMode(models.TextChoices):
        SOLO = "solo", "Solo"
        GROUP = "group", "Group"

    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_events")
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    starts_at = models.DateTimeField()
    category = models.CharField(max_length=40, choices=Category.choices, default=Category.PERSONAL)
    quest_mode = models.CharField(max_length=20, choices=QuestMode.choices, default=QuestMode.SOLO)
    is_completed = models.BooleanField(default=False)
    location = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["starts_at"]

    def can_user_view(self, user):
        if self.creator_id == user.id:
            return True

        return self.participants.filter(
            user=user,
            status=EventParticipant.Status.ACCEPTED,
        ).exists()

    def can_user_edit(self, user):
        return self.creator_id == user.id

    def __str__(self):
        return self.title


class EventParticipant(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        DECLINED = "declined", "Declined"
        EXPIRED = "expired", "Expired"

    EXPIRATION_WINDOW = timedelta(hours=12)

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="event_invitations")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    invited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["event", "user"]

    def can_user_respond(self, user):
        return self.user_id == user.id

    def is_expired(self):
        return (
            self.status == self.Status.PENDING
            and self.invited_at <= timezone.now() - self.EXPIRATION_WINDOW
        )

    def expire_if_needed(self):
        if self.is_expired():
            self.status = self.Status.EXPIRED
            self.save(update_fields=["status"])
            return True

        return False

    def __str__(self):
        return f"{self.user} -> {self.event} ({self.status})"
