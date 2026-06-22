from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Achievement

User = get_user_model()


class AchievementApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="badges@example.com",
            username="badges",
            password="StrongPass123!",
        )

    def test_user_can_list_their_achievements(self):
        Achievement.objects.create(
            user=self.user,
            badge_name="First Challenge Completed",
            badge_level="bronze",
        )
        self.client.force_authenticate(self.user)

        response = self.client.get(reverse("achievement-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["badge_name"], "First Challenge Completed")

    def test_user_cannot_manually_create_or_delete_achievements(self):
        achievement = Achievement.objects.create(
            user=self.user,
            badge_name="First Challenge Completed",
            badge_level="bronze",
        )
        self.client.force_authenticate(self.user)

        create_response = self.client.post(
            reverse("achievement-list"),
            {
                "badge_name": "Fake Badge",
                "badge_level": "gold",
            },
            format="json",
        )
        delete_response = self.client.delete(reverse("achievement-detail", args=[achievement.id]))

        self.assertEqual(create_response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(delete_response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)
        self.assertEqual(Achievement.objects.count(), 1)
