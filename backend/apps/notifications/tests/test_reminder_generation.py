from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone

from apps.challenges.models import Challenge
from apps.notifications.models import Notification
from apps.notifications.services import generate_due_reminders
from apps.planner.models import Event, EventParticipant

User = get_user_model()


class ReminderGenerationTests(TestCase):
    def setUp(self):
        self.creator = User.objects.create_user(
            username="creator",
            email="creator@example.com",
            password="strongpass123",
        )
        self.invitee = User.objects.create_user(
            username="invitee",
            email="invitee@example.com",
            password="strongpass123",
        )

    def test_event_reminder_created_for_creator_and_accepted_participant(self):
        event = Event.objects.create(
            creator=self.creator,
            title="Planning sync",
            description="Prep work",
            starts_at=timezone.now() + timedelta(hours=1),
            category="work",
        )
        EventParticipant.objects.create(
            event=event,
            user=self.invitee,
            status=EventParticipant.Status.ACCEPTED,
        )

        generate_due_reminders(now=timezone.now())

        self.assertEqual(
            Notification.objects.filter(type="event_reminder", payload__event_id=event.id).count(),
            2,
        )

    def test_event_reminder_not_created_for_completed_event(self):
        event = Event.objects.create(
            creator=self.creator,
            title="Done already",
            description="Already done",
            starts_at=timezone.now() + timedelta(minutes=5),
            category="work",
            is_completed=True,
        )

        generate_due_reminders(now=timezone.now())

        self.assertFalse(Notification.objects.filter(payload__event_id=event.id).exists())

    def test_challenge_reminder_created_for_active_challenge_owner(self):
        challenge = Challenge.objects.create(
            creator=self.creator,
            title="Daily writing",
            description="Keep it going",
        )

        generate_due_reminders(now=timezone.now())

        self.assertTrue(
            Notification.objects.filter(type="challenge_reminder", payload__challenge_id=challenge.id).exists()
        )
