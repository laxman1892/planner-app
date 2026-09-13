from django.db.models import Sum

from .models import ProgressLedger


LEVEL_STEP_XP = 100


def award_xp(*, user, source_type, source_id, action, xp_delta):
    entry, _ = ProgressLedger.objects.get_or_create(
        user=user,
        source_type=source_type,
        source_id=source_id,
        action=action,
        defaults={"xp_delta": xp_delta},
    )
    return entry


def get_total_xp(user):
    return (
        ProgressLedger.objects.filter(user=user).aggregate(total=Sum("xp_delta"))["total"]
        or 0
    )


def get_level_for_xp(total_xp):
    return (total_xp // LEVEL_STEP_XP) + 1


def get_progress_summary(user):
    total_xp = get_total_xp(user)
    level = get_level_for_xp(total_xp)

    return {
        "total_xp": total_xp,
        "level": level,
        "next_level_xp": level * LEVEL_STEP_XP,
    }
