from django.db.models import Q
from rest_framework import serializers

from .models import Event, EventParticipant


def visible_events_for_user(user):
    accepted_participant_filter = Q(
        participants__user=user,
        participants__status=EventParticipant.Status.ACCEPTED,
    )

    return (
        Event.objects.filter(Q(creator=user) | accepted_participant_filter)
        .distinct()
        .prefetch_related("participants__user")
    )


def visible_event_participants_for_user(user):
    return EventParticipant.objects.filter(Q(user=user) | Q(event__creator=user)).select_related("event", "user")


def create_event_invitation(*, creator, event_id, invited_user_id):
    try:
        event = Event.objects.get(id=event_id, creator=creator)
    except Event.DoesNotExist as exc:
        raise serializers.ValidationError({"event": "You can only invite users to events you own."}) from exc

    if event.creator_id == invited_user_id:
        raise serializers.ValidationError({"user": "The event creator does not need an invitation."})

    invitation, created = EventParticipant.objects.get_or_create(
        event=event,
        user_id=invited_user_id,
        defaults={"status": EventParticipant.Status.PENDING},
    )

    if not created:
        raise serializers.ValidationError({"user": "An invitation for this user already exists."})

    return invitation
