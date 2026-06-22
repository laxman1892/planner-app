from rest_framework import serializers

from apps.achievements.services import award_challenge_completion_badges, award_progress_badges

from .models import Challenge, ChallengeProgress


def visible_challenges_for_user(user):
    return Challenge.objects.filter(creator=user)


def visible_progress_for_user(user):
    return ChallengeProgress.objects.filter(user=user, challenge__creator=user)


def create_self_challenge(*, creator, **validated_data):
    return Challenge.objects.create(
        creator=creator,
        challenge_type=Challenge.ChallengeType.SELF,
        **validated_data,
    )


def complete_challenge(*, challenge, actor):
    if challenge.creator_id != actor.id:
        raise serializers.ValidationError("You can only complete your own challenges.")

    if not challenge.is_completed:
        challenge.is_completed = True
        challenge.save(update_fields=["is_completed"])

    award_challenge_completion_badges(actor)
    return challenge


def create_progress_log(*, challenge, actor, **validated_data):
    if challenge.creator_id != actor.id:
        raise serializers.ValidationError("You can only log progress for your own challenges.")

    if challenge.is_completed:
        raise serializers.ValidationError("Completed challenges cannot receive new progress logs.")

    progress = ChallengeProgress.objects.create(
        challenge=challenge,
        user=actor,
        **validated_data,
    )
    award_progress_badges(actor)
    return progress
