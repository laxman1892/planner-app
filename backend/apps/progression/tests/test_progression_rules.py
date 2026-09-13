from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.progression.models import ProgressLedger
from apps.progression.services import award_xp, get_level_for_xp, get_progress_summary, get_total_xp

User = get_user_model()


class ProgressionRuleTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="hero",
            email="hero@example.com",
            password="strongpass123",
        )

    def test_level_is_derived_from_total_xp(self):
        self.assertEqual(get_level_for_xp(0), 1)
        self.assertEqual(get_level_for_xp(100), 2)
        self.assertEqual(get_level_for_xp(250), 3)

    def test_event_completion_awards_xp(self):
        award_xp(
            user=self.user,
            source_type="event",
            source_id=1,
            action="event_completed",
            xp_delta=50,
        )

        self.assertEqual(get_total_xp(self.user), 50)

    def test_challenge_completion_awards_xp(self):
        award_xp(
            user=self.user,
            source_type="challenge",
            source_id=2,
            action="challenge_completed",
            xp_delta=80,
        )

        summary = get_progress_summary(self.user)

        self.assertEqual(summary["total_xp"], 80)
        self.assertEqual(summary["level"], 1)
        self.assertEqual(summary["next_level_xp"], 100)

    def test_duplicate_reward_event_is_idempotent(self):
        award_xp(
            user=self.user,
            source_type="challenge",
            source_id=9,
            action="challenge_completed",
            xp_delta=120,
        )
        award_xp(
            user=self.user,
            source_type="challenge",
            source_id=9,
            action="challenge_completed",
            xp_delta=120,
        )

        self.assertEqual(ProgressLedger.objects.count(), 1)
        self.assertEqual(get_total_xp(self.user), 120)
