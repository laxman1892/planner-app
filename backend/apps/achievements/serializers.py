from rest_framework import serializers

from .models import Achievement


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ["id", "user", "badge_name", "badge_level", "earned_at"]
        read_only_fields = ["id", "user", "earned_at"]
