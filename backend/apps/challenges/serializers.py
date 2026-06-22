from rest_framework import serializers

from apps.accounts.serializers import UserSerializer
from .services import create_progress_log
from .models import Challenge, ChallengeProgress


class ChallengeProgressSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source="user", read_only=True)

    class Meta:
        model = ChallengeProgress
        fields = ["id", "challenge", "user", "user_detail", "date", "progress_note", "created_at"]
        read_only_fields = ["id", "user", "created_at"]

    def validate_challenge(self, value):
        return value

    def validate(self, attrs):
        request = self.context.get("request")
        challenge = attrs.get("challenge", getattr(self.instance, "challenge", None))
        log_date = attrs.get("date", getattr(self.instance, "date", None))

        if (
            request
            and challenge
            and log_date
            and ChallengeProgress.objects.filter(
                challenge=challenge,
                user=request.user,
                date=log_date,
            )
            .exclude(pk=getattr(self.instance, "pk", None))
            .exists()
        ):
            raise serializers.ValidationError({"date": "Progress is already logged for this challenge on this date."})

        return attrs

    def create(self, validated_data):
        request = self.context["request"]
        return create_progress_log(
            challenge=validated_data["challenge"],
            actor=request.user,
            date=validated_data["date"],
            progress_note=validated_data["progress_note"],
        )


class ChallengeSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)
    progress_logs = ChallengeProgressSerializer(many=True, read_only=True)

    class Meta:
        model = Challenge
        fields = [
            "id",
            "creator",
            "title",
            "description",
            "deadline",
            "challenge_type",
            "is_completed",
            "progress_logs",
            "created_at",
        ]
        read_only_fields = ["id", "creator", "challenge_type", "is_completed", "created_at"]
        extra_kwargs = {
            "description": {"required": True, "allow_blank": False},
        }

    def validate(self, attrs):
        if self.instance and "challenge_type" in attrs and attrs["challenge_type"] != Challenge.ChallengeType.SELF:
            raise serializers.ValidationError({"challenge_type": "Only self challenges are supported in MVP."})

        return attrs
