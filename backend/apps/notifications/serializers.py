from rest_framework import serializers

from .models import Notification, NotificationPreference


class NotificationSerializer(serializers.ModelSerializer):
    is_read = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ["id", "type", "title", "body", "payload", "is_read", "read_at", "created_at"]
        read_only_fields = fields

    def get_is_read(self, obj):
        return obj.is_read


class NotificationReadSerializer(serializers.ModelSerializer):
    is_read = serializers.BooleanField(write_only=True)

    class Meta:
        model = Notification
        fields = ["is_read"]

    def validate_is_read(self, value):
        if value is not True:
            raise serializers.ValidationError("Notifications can only be marked as read.")
        return value

    def update(self, instance, validated_data):
        instance.mark_read()
        return instance


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationPreference
        fields = [
            "invite_email",
            "invite_in_app",
            "event_reminder_email",
            "event_reminder_in_app",
            "challenge_reminder_email",
            "challenge_reminder_in_app",
        ]

