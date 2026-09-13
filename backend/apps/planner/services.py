from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import serializers

from apps.notifications.services import create_notification, get_or_create_preferences

from .models import Event, EventParticipant

User = get_user_model()


def visible_events_for_user(user):
    accepted_participant_filter = Q(
        participants__user=user,
        participants__status=EventParticipant.Status.ACCEPTED,
    )

    return (
        Event.objects.filter(Q(creator=user) | accepted_participant_filter)
        .distinct()
        .prefetch_related("participants__user")
        .order_by("is_completed", "starts_at")
    )


def visible_event_participants_for_user(user):
    return EventParticipant.objects.filter(Q(user=user) | Q(event__creator=user)).select_related("event", "user")


def sync_invitation_expiration(invitation):
    invitation.expire_if_needed()
    return invitation


def resolve_invited_user_id(identifier):
    try:
        return User.objects.get(Q(email__iexact=identifier) | Q(username__iexact=identifier)).id
    except User.DoesNotExist as exc:
        raise serializers.ValidationError({"identifier": "No user matches that email or username."}) from exc


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

    notify_invitation_created(invitation)

    return invitation


def notify_invitation_created(invitation):
    preferences = get_or_create_preferences(invitation.user)
    create_notification(
        user=invitation.user,
        type="invite_sent",
        title="New event quest invitation",
        body=f"You were invited to join {invitation.event.title}.",
        payload={
            "event_id": invitation.event_id,
            "event_title": invitation.event.title,
            "actor_email": invitation.event.creator.email,
        },
        include_email=preferences.invite_email,
        include_in_app=preferences.invite_in_app,
    )


def notify_invitation_response(invitation):
    if invitation.status not in (
        EventParticipant.Status.ACCEPTED,
        EventParticipant.Status.DECLINED,
    ):
        return

    preferences = get_or_create_preferences(invitation.event.creator)
    create_notification(
        user=invitation.event.creator,
        type="invite_accepted" if invitation.status == EventParticipant.Status.ACCEPTED else "invite_declined",
        title=(
            "Invitation accepted"
            if invitation.status == EventParticipant.Status.ACCEPTED
            else "Invitation declined"
        ),
        body=f"{invitation.user.email} responded to {invitation.event.title}.",
        payload={
            "event_id": invitation.event_id,
            "event_title": invitation.event.title,
            "actor_email": invitation.user.email,
        },
        include_email=preferences.invite_email,
        include_in_app=preferences.invite_in_app,
    )
