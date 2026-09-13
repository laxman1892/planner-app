from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.notifications.models import Notification, NotificationPreference

User = get_user_model()


class NotificationApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="hero",
            email="hero@example.com",
            password="strongpass123",
        )
        token_response = self.client.post(
            "/api/auth/token/",
            {"login": "hero@example.com", "password": "strongpass123"},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token_response.data['access']}")

    def test_user_can_list_their_notifications(self):
        Notification.objects.create(
            user=self.user,
            type="invite_sent",
            title="Invitation sent",
            body="You invited a user.",
        )

        response = self.client.get("/api/notifications/")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_user_can_mark_notification_read(self):
        notification = Notification.objects.create(
            user=self.user,
            type="invite_sent",
            title="Invitation sent",
            body="You invited a user.",
        )

        response = self.client.patch(
            f"/api/notifications/{notification.id}/",
            {"is_read": True},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notification.refresh_from_db()
        self.assertIsNotNone(notification.read_at)

    def test_user_can_get_and_update_preferences(self):
        response = self.client.get("/api/notification-preferences/me/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        update = self.client.patch(
            "/api/notification-preferences/me/",
            {"event_reminder_email": False},
            format="json",
        )

        self.assertEqual(update.status_code, status.HTTP_200_OK)
        self.assertFalse(update.data["event_reminder_email"])
