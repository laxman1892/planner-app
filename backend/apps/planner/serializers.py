from rest_framework import serializers

from apps.accounts.serializers import UserSerializer
from .models import Event, EventParticipant


class EventParticipantSerializer(serializers.ModelSerializer):
    identifier = serializers.CharField(write_only=True, required=False)
    user_detail = UserSerializer(source="user", read_only=True)
    creator_detail = UserSerializer(source="event.creator", read_only=True)
    event_preview = serializers.SerializerMethodField()

    class Meta:
        model = EventParticipant
        fields = [
            "id",
            "event",
            "user",
            "identifier",
            "user_detail",
            "creator_detail",
            "event_preview",
            "status",
            "invited_at",
        ]
        read_only_fields = ["id", "invited_at"]
        validators = []
        extra_kwargs = {
            "user": {"required": False},
        }

    def get_event_preview(self, obj):
        return {
            "title": obj.event.title,
            "starts_at": obj.event.starts_at.isoformat().replace("+00:00", "Z"),
            "category": obj.event.category,
        }

    def validate(self, attrs):
        from .services import sync_invitation_expiration

        if self.instance:
            sync_invitation_expiration(self.instance)

            if "event" in attrs and attrs["event"].id != self.instance.event_id:
                raise serializers.ValidationError({"event": "The event cannot be changed."})

            if "user" in attrs and attrs["user"].id != self.instance.user_id:
                raise serializers.ValidationError({"user": "The invited user cannot be changed."})

            if (
                "status" in attrs
                and self.instance.status == EventParticipant.Status.EXPIRED
                and attrs["status"] != EventParticipant.Status.EXPIRED
            ):
                raise serializers.ValidationError({"status": "This invitation has expired."})

        return attrs

    def create(self, validated_data):
        from .services import create_event_invitation, resolve_invited_user_id

        request = self.context["request"]
        invited_user_id = (
            validated_data["user"].id
            if "user" in validated_data
            else resolve_invited_user_id(validated_data["identifier"].strip())
        )
        invitation = create_event_invitation(
            creator=request.user,
            event_id=validated_data["event"].id,
            invited_user_id=invited_user_id,
        )

        return invitation

    def to_representation(self, instance):
        from .services import sync_invitation_expiration

        instance = sync_invitation_expiration(instance)
        return super().to_representation(instance)


class EventSerializer(serializers.ModelSerializer):
    creator = UserSerializer(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "creator",
            "title",
            "description",
            "starts_at",
            "category",
            "quest_mode",
            "is_completed",
            "created_at",
        ]
        read_only_fields = ["id", "creator", "created_at"]
        extra_kwargs = {
            "description": {"required": True, "allow_blank": False},
        }
