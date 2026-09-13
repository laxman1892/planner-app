from django.conf import settings
from django.db import models


class Challenge(models.Model):
    class ChallengeType(models.TextChoices):
        SELF = "self", "Self Challenge"
        GROUP = "group", "Group Challenge"

    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="created_challenges")
    participants = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="challenges", blank=True)
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    deadline = models.DateField(blank=True, null=True)
    streak_goal_days = models.PositiveIntegerField(blank=True, null=True)
    category_tags = models.JSONField(default=list, blank=True)
    challenge_type = models.CharField(max_length=20, choices=ChallengeType.choices, default=ChallengeType.SELF)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def can_user_access(self, user):
        return self.creator_id == user.id

    def can_user_log_progress(self, user):
        return self.creator_id == user.id and not self.is_completed

    def __str__(self):
        return self.title


class ChallengeProgress(models.Model):
    challenge = models.ForeignKey(Challenge, on_delete=models.CASCADE, related_name="progress_logs")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="challenge_progress")
    date = models.DateField()
    progress_note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]
        unique_together = ["challenge", "user", "date"]

    def can_user_edit(self, user):
        return self.user_id == user.id and self.challenge.creator_id == user.id

    def __str__(self):
        return f"{self.user} - {self.challenge} - {self.date}"
