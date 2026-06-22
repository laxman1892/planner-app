from datetime import datetime, timezone as datetime_timezone

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.planner.models import Event, EventParticipant

User = get_user_model()


class EventInvitationTests(APITestCase):
    def setUp(self):
        self.creator = User.objects.create_user(
            email="creator@example.com",
            username="creator",
            password="StrongPass123!",
        )
        self.invited_user = User.objects.create_user(
            email="invitee@example.com",
            username="invitee",
            password="StrongPass123!",
        )
        self.other_user = User.objects.create_user(
            email="outsider@example.com",
            username="outsider",
            password="StrongPass123!",
        )
        self.event = Event.objects.create(
            creator=self.creator,
            title="Shared planning",
            description="Discuss sprint work",
            starts_at=datetime(2026, 5, 1, 9, 0, tzinfo=datetime_timezone.utc),
        )

    def test_event_creator_can_create_pending_invitation(self):
        self.client.force_authenticate(self.creator)

        response = self.client.post(
            reverse("event-participant-list"),
            {
                "event": self.event.id,
                "user": self.invited_user.id,
                "status": EventParticipant.Status.ACCEPTED,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], EventParticipant.Status.PENDING)
        self.assertEqual(response.data["user"], self.invited_user.id)

    def test_non_creator_cannot_create_invitation(self):
        self.client.force_authenticate(self.other_user)

        response = self.client.post(
            reverse("event-participant-list"),
            {
                "event": self.event.id,
                "user": self.invited_user.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("event", response.data)

    def test_creator_cannot_invite_same_user_twice(self):
        EventParticipant.objects.create(event=self.event, user=self.invited_user)
        self.client.force_authenticate(self.creator)

        response = self.client.post(
            reverse("event-participant-list"),
            {
                "event": self.event.id,
                "user": self.invited_user.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("user", response.data)

    def test_invited_user_can_update_their_own_status(self):
        invitation = EventParticipant.objects.create(event=self.event, user=self.invited_user)
        self.client.force_authenticate(self.invited_user)

        response = self.client.patch(
            reverse("event-participant-detail", args=[invitation.id]),
            {"status": EventParticipant.Status.ACCEPTED},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], EventParticipant.Status.ACCEPTED)

    def test_creator_cannot_update_invited_users_status(self):
        invitation = EventParticipant.objects.create(event=self.event, user=self.invited_user)
        self.client.force_authenticate(self.creator)

        response = self.client.patch(
            reverse("event-participant-detail", args=[invitation.id]),
            {"status": EventParticipant.Status.ACCEPTED},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        invitation.refresh_from_db()
        self.assertEqual(invitation.status, EventParticipant.Status.PENDING)

    def test_unrelated_user_cannot_view_invitation(self):
        invitation = EventParticipant.objects.create(event=self.event, user=self.invited_user)
        self.client.force_authenticate(self.other_user)

        response = self.client.get(reverse("event-participant-detail", args=[invitation.id]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
