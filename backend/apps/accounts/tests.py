from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class AuthFlowTests(APITestCase):
    def test_user_can_register_login_and_fetch_profile(self):
        registration = self.client.post(
            reverse("register"),
            {
                "email": "new.user@example.com",
                "username": "newuser",
                "first_name": "New",
                "last_name": "User",
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(registration.status_code, status.HTTP_201_CREATED)
        self.assertIn("access", registration.data)
        self.assertIn("refresh", registration.data)
        self.assertEqual(registration.data["user"]["email"], "new.user@example.com")

        login = self.client.post(
            reverse("token_obtain_pair"),
            {
                "login": "new.user@example.com",
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")

        profile = self.client.get(reverse("profile"))

        self.assertEqual(profile.status_code, status.HTTP_200_OK)
        self.assertEqual(profile.data["email"], "new.user@example.com")

        username_login = self.client.post(
            reverse("token_obtain_pair"),
            {
                "login": "newuser",
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(username_login.status_code, status.HTTP_200_OK)
        self.assertIn("access", username_login.data)
