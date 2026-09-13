from django.conf import settings
from django.db import models


class ProgressLedger(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="progress_entries")
    source_type = models.CharField(max_length=40)
    source_id = models.PositiveIntegerField()
    action = models.CharField(max_length=60)
    xp_delta = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["user", "source_type", "source_id", "action"],
                name="progress_unique_user_source_action",
            )
        ]

