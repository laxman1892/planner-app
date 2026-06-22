from datetime import datetime, timezone as datetime_timezone

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.planner.models import Event, EventParticipant

User = get_user_model()


class EventVisibilityTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="planner@example.com",
            username="planner",
            password="StrongPass123!",
        )
        self.other_user = User.objects.create_user(
            email="other@example.com",
            username="other",
            password="StrongPass123!",
        )

    def create_event(self, creator, title="Mine"):
        return Event.objects.create(
            creator=creator,
            title=title,
            description="Existing event description",
            starts_at=datetime(2026, 5, 1, 9, 0, tzinfo=datetime_timezone.utc),
        )

    def invite_user(self, event, user, status=EventParticipant.Status.PENDING):
        return EventParticipant.objects.create(event=event, user=user, status=status)

    def test_user_can_create_personal_event(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("event-list"),
            {
                "title": "Morning planning",
                "description": "Review weekly priorities",
                "starts_at": "2026-05-01T09:00:00Z",
                "category": "work",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "Morning planning")
        self.assertEqual(response.data["category"], "work")
        self.assertEqual(response.data["creator"]["email"], self.user.email)
        self.assertEqual(Event.objects.get().creator, self.user)

    def test_description_is_required_for_personal_event(self):
        self.client.force_authenticate(self.user)

        response = self.client.post(
            reverse("event-list"),
            {
                "title": "Morning planning",
                "starts_at": "2026-05-01T09:00:00Z",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("description", response.data)

    def test_user_only_sees_their_own_events(self):
        self.create_event(self.user)
        self.create_event(self.other_user, title="Not mine")
        self.client.force_authenticate(self.user)

        response = self.client.get(reverse("event-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Mine")

    def test_accepted_participant_can_see_event_in_list_and_detail(self):
        event = self.create_event(self.other_user, title="Shared event")
        self.invite_user(event, self.user, status=EventParticipant.Status.ACCEPTED)
        self.client.force_authenticate(self.user)

        list_response = self.client.get(reverse("event-list"))
        detail_response = self.client.get(reverse("event-detail", args=[event.id]))

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 1)
        self.assertEqual(list_response.data[0]["title"], "Shared event")
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data["title"], "Shared event")

    def test_pending_participant_cannot_see_event(self):
        event = self.create_event(self.other_user, title="Pending share")
        self.invite_user(event, self.user, status=EventParticipant.Status.PENDING)
        self.client.force_authenticate(self.user)

        list_response = self.client.get(reverse("event-list"))
        detail_response = self.client.get(reverse("event-detail", args=[event.id]))

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(list_response.data, [])
        self.assertEqual(detail_response.status_code, status.HTTP_404_NOT_FOUND)

    def test_declined_participant_cannot_see_event(self):
        event = self.create_event(self.other_user, title="Declined share")
        self.invite_user(event, self.user, status=EventParticipant.Status.DECLINED)
        self.client.force_authenticate(self.user)

        list_response = self.client.get(reverse("event-list"))
        detail_response = self.client.get(reverse("event-detail", args=[event.id]))

        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(list_response.data, [])
        self.assertEqual(detail_response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_update_and_delete_own_event(self):
        event = self.create_event(self.user)
        self.client.force_authenticate(self.user)

        update_response = self.client.patch(
            reverse("event-detail", args=[event.id]),
            {"title": "Updated plan"},
            format="json",
        )

        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["title"], "Updated plan")

        delete_response = self.client.delete(reverse("event-detail", args=[event.id]))

        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Event.objects.filter(id=event.id).exists())

    def test_user_cannot_update_or_delete_another_users_event(self):
        event = self.create_event(self.other_user, title="Private event")
        self.client.force_authenticate(self.user)

        update_response = self.client.patch(
            reverse("event-detail", args=[event.id]),
            {"title": "Nope"},
            format="json",
        )
        delete_response = self.client.delete(reverse("event-detail", args=[event.id]))

        self.assertEqual(update_response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(delete_response.status_code, status.HTTP_404_NOT_FOUND)
        event.refresh_from_db()
        self.assertEqual(event.title, "Private event")

    def test_accepted_participant_cannot_update_or_delete_shared_event(self):
        event = self.create_event(self.other_user, title="Shared event")
        self.invite_user(event, self.user, status=EventParticipant.Status.ACCEPTED)
        self.client.force_authenticate(self.user)

        update_response = self.client.patch(
            reverse("event-detail", args=[event.id]),
            {"title": "Not allowed"},
            format="json",
        )
        delete_response = self.client.delete(reverse("event-detail", args=[event.id]))

        self.assertEqual(update_response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(delete_response.status_code, status.HTTP_403_FORBIDDEN)
        event.refresh_from_db()
        self.assertEqual(event.title, "Shared event")
