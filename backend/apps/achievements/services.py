from datetime import timedelta

from apps.challenges.models import Challenge, ChallengeProgress
from .models import Achievement


FIRST_CHALLENGE_BADGE = "First Challenge Completed"
SEVEN_DAY_STREAK_BADGE = "7-Day Streak"
TEN_CHALLENGES_BADGE = "10 Challenges Completed"


def award_badge(user, badge_name, badge_level="bronze"):
    achievement, _ = Achievement.objects.get_or_create(
        user=user,
        badge_name=badge_name,
        badge_level=badge_level,
    )

    return achievement


def award_challenge_completion_badges(user):
    award_badge(user, FIRST_CHALLENGE_BADGE)

    completed_count = Challenge.objects.filter(creator=user, is_completed=True).count()
    if completed_count >= 10:
        award_badge(user, TEN_CHALLENGES_BADGE, badge_level="gold")


def award_progress_badges(user):
    progress_dates = set(
        ChallengeProgress.objects.filter(user=user, challenge__creator=user).values_list("date", flat=True)
    )

    if len(progress_dates) < 7:
        return

    for progress_date in progress_dates:
        if all(progress_date - timedelta(days=offset) in progress_dates for offset in range(7)):
            award_badge(user, SEVEN_DAY_STREAK_BADGE, badge_level="silver")
            return
