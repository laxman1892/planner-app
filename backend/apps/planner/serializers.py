from rest_framework import serializers

from apps.accounts.serializers import UserSerializer
from .models import Event, EventParticipant


class EventParticipantSerializer(serializers.ModelSerializer):
    user_detail = UserSerializer(source="user", read_only=True)

    class Meta:
        model = EventParticipant
        fields = ["id", "event", "user", "user_detail", "status", "invited_at"]
        read_only_fields = ["id", "invited_at"]
        validators = []

    def validate(self, attrs):
        if self.instance:
            if "event" in attrs and attrs["event"].id != self.instance.event_id:
                raise serializers.ValidationError({"event": "The event cannot be changed."})

            if "user" in attrs and attrs["user"].id != self.instance.user_id:
                raise serializers.ValidationError({"user": "The invited user cannot be changed."})

        return attrs

    def create(self, validated_data):
        from .services import create_event_invitation

        request = self.context["request"]
        invitation = create_event_invitation(
            creator=request.user,
            event_id=validated_data["event"].id,
            invited_user_id=validated_data["user"].id,
        )

        return invitation


class EventSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ["id", "creator", "title", "description", "starts_at", "category", "created_at"]
        read_only_fields = ["id", "creator", "created_at"]
        extra_kwargs = {
            "description": {"required": True, "allow_blank": False},
        }
