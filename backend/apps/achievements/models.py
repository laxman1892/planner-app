from django.conf import settings
from django.db import models


class Achievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="achievements")
    badge_name = models.CharField(max_length=120)
    badge_level = models.CharField(max_length=40, default="bronze")
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-earned_at"]
        unique_together = ["user", "badge_name", "badge_level"]

    def __str__(self):
        return f"{self.user} - {self.badge_name}"
