from django.conf import settings
from django.db import models


class Event(models.Model):
    class Category(models.TextChoices):
        PERSONAL = "personal", "Personal"
        WORK = "work", "Work"
        STUDY = "study", "Study"
        HEALTH = "health", "Health"

    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_events")
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    starts_at = models.DateTimeField()
    category = models.CharField(max_length=40, choices=Category.choices, default=Category.PERSONAL)
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

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="participants")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="event_invitations")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    invited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["event", "user"]

    def can_user_respond(self, user):
        return self.user_id == user.id

    def __str__(self):
        return f"{self.user} -> {self.event} ({self.status})"
