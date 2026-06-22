from datetime import date, timedelta

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.achievements.models import Achievement
from apps.challenges.models import Challenge, ChallengeProgress

User = get_user_model()


class ChallengeProgressPermissionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="challenger@example.com",
            username="challenger",
            password="StrongPass123!",
        )
        self.other_user = User.objects.create_user(
            email="other.challenger@example.com",
            username="otherchallenger",
            password="StrongPass123!",
        )

    def create_challenge(self, creator, title="Read daily"):
        return Challenge.objects.create(
            creator=creator,
            title=title,
            description="Read at least twenty pages.",
            deadline=date(2026, 5, 31),
        )

    def test_user_can_log_one_progress_entry_per_challenge_day(self):
        challenge = self.create_challenge(self.user)
        self.client.force_authenticate(self.user)

        first_response = self.client.post(
            reverse("challenge-progress-list"),
            {
                "challenge": challenge.id,
                "date": "2026-05-01",
                "progress_note": "Read twenty-five pages.",
            },
            format="json",
        )
        duplicate_response = self.client.post(
            reverse("challenge-progress-list"),
            {
                "challenge": challenge.id,
                "date": "2026-05-01",
                "progress_note": "Read more pages.",
            },
            format="json",
        )

        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(duplicate_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ChallengeProgress.objects.count(), 1)

    def test_user_cannot_log_progress_for_another_users_challenge(self):
        challenge = self.create_challenge(self.other_user)
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("challenge-progress-list"),
            {
                "challenge": challenge.id,
                "date": "2026-05-01",
                "progress_note": "Trying this.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ChallengeProgress.objects.count(), 0)

    def test_user_can_update_and_delete_own_progress_log(self):
        challenge = self.create_challenge(self.user)
        progress = ChallengeProgress.objects.create(
            challenge=challenge,
            user=self.user,
            date=date(2026, 5, 1),
            progress_note="Initial note.",
        )
        self.client.force_authenticate(self.user)

        update_response = self.client.patch(
            reverse("challenge-progress-detail", args=[progress.id]),
            {"progress_note": "Updated note."},
            format="json",
        )

        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["progress_note"], "Updated note.")

        delete_response = self.client.delete(reverse("challenge-progress-detail", args=[progress.id]))

        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(ChallengeProgress.objects.filter(id=progress.id).exists())

    def test_user_cannot_update_or_delete_another_users_progress_log(self):
        challenge = self.create_challenge(self.other_user)
        progress = ChallengeProgress.objects.create(
            challenge=challenge,
            user=self.other_user,
            date=date(2026, 5, 1),
            progress_note="Private note.",
        )
        self.client.force_authenticate(self.user)

        update_response = self.client.patch(
            reverse("challenge-progress-detail", args=[progress.id]),
            {"progress_note": "Nope."},
            format="json",
        )
        delete_response = self.client.delete(reverse("challenge-progress-detail", args=[progress.id]))

        self.assertEqual(update_response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(delete_response.status_code, status.HTTP_404_NOT_FOUND)
        progress.refresh_from_db()
        self.assertEqual(progress.progress_note, "Private note.")

    def test_completed_challenge_cannot_receive_progress_logs(self):
        challenge = self.create_challenge(self.user)
        challenge.is_completed = True
        challenge.save(update_fields=["is_completed"])
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("challenge-progress-list"),
            {
                "challenge": challenge.id,
                "date": "2026-05-01",
                "progress_note": "Trying after completion.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(ChallengeProgress.objects.count(), 0)

    def test_completing_first_challenge_awards_badge_once(self):
        challenge = self.create_challenge(self.user)
        self.client.force_authenticate(self.user)

        first_response = self.client.post(reverse("challenge-complete", args=[challenge.id]))
        second_response = self.client.post(reverse("challenge-complete", args=[challenge.id]))

        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        challenge.refresh_from_db()
        self.assertTrue(challenge.is_completed)
        self.assertEqual(
            Achievement.objects.filter(
                user=self.user,
                badge_name="First Challenge Completed",
                badge_level="bronze",
            ).count(),
            1,
        )

    def test_completing_tenth_challenge_awards_gold_badge(self):
        challenges = [self.create_challenge(self.user, title=f"Challenge {index}") for index in range(10)]
        self.client.force_authenticate(self.user)

        for challenge in challenges:
            response = self.client.post(reverse("challenge-complete", args=[challenge.id]))
            self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.assertEqual(
            Achievement.objects.filter(
                user=self.user,
                badge_name="10 Challenges Completed",
                badge_level="gold",
            ).count(),
            1,
        )

    def test_logging_seven_day_progress_streak_awards_badge_once(self):
        challenge = self.create_challenge(self.user)
        start_date = date(2026, 5, 1)
        self.client.force_authenticate(self.user)

        for offset in range(7):
            response = self.client.post(
                reverse("challenge-progress-list"),
                {
                    "challenge": challenge.id,
                    "date": (start_date + timedelta(days=offset)).isoformat(),
                    "progress_note": f"Day {offset + 1} done.",
                },
                format="json",
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertEqual(
            Achievement.objects.filter(
                user=self.user,
                badge_name="7-Day Streak",
                badge_level="silver",
            ).count(),
            1,
        )
