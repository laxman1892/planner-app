from datetime import date

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.challenges.models import Challenge

User = get_user_model()


class GroupChallengePolicyTests(APITestCase):
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

    def test_user_can_create_self_challenge(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("challenge-list"),
            {
                "title": "Run daily",
                "description": "Run for at least twenty minutes.",
                "deadline": "2026-05-31",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Run daily")
        self.assertEqual(response.data["challenge_type"], Challenge.ChallengeType.SELF)
        self.assertFalse(response.data["is_completed"])
        self.assertEqual(Challenge.objects.get().creator, self.user)
        self.assertEqual(Challenge.objects.get().challenge_type, Challenge.ChallengeType.SELF)

    def test_description_is_required_for_self_challenge(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("challenge-list"),
            {
                "title": "Run daily",
                "deadline": "2026-05-31",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("description", response.data)

    def test_user_only_sees_their_own_challenges(self):
        self.create_challenge(self.user)
        self.create_challenge(self.other_user, title="Private challenge")
        self.client.force_authenticate(self.user)

        response = self.client.get(reverse("challenge-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Read daily")

    def test_user_can_update_and_delete_own_challenge(self):
        challenge = self.create_challenge(self.user)
        self.client.force_authenticate(self.user)

        update_response = self.client.patch(
            reverse("challenge-detail", args=[challenge.id]),
            {"title": "Updated challenge"},
            format="json",
        )

        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["title"], "Updated challenge")

        delete_response = self.client.delete(reverse("challenge-detail", args=[challenge.id]))

        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Challenge.objects.filter(id=challenge.id).exists())

    def test_user_cannot_update_or_delete_another_users_challenge(self):
        challenge = self.create_challenge(self.other_user, title="Private challenge")
        self.client.force_authenticate(self.user)

        update_response = self.client.patch(
            reverse("challenge-detail", args=[challenge.id]),
            {"title": "Nope"},
            format="json",
        )
        delete_response = self.client.delete(reverse("challenge-detail", args=[challenge.id]))

        self.assertEqual(update_response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(delete_response.status_code, status.HTTP_404_NOT_FOUND)
        challenge.refresh_from_db()
        self.assertEqual(challenge.title, "Private challenge")

    def test_user_cannot_complete_another_users_challenge(self):
        challenge = self.create_challenge(self.other_user)
        self.client.force_authenticate(self.user)

        response = self.client.post(reverse("challenge-complete", args=[challenge.id]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        challenge.refresh_from_db()
        self.assertFalse(challenge.is_completed)

    def test_user_cannot_create_group_challenge_through_api(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("challenge-list"),
            {
                "title": "Team challenge",
                "description": "Try to force a group challenge.",
                "deadline": "2026-05-31",
                "challenge_type": Challenge.ChallengeType.GROUP,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["challenge_type"], Challenge.ChallengeType.SELF)
