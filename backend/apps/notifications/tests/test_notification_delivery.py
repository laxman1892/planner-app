from django.contrib.auth import get_user_model
from django.core import mail
from django.test import TestCase, override_settings

from apps.notifications.models import NotificationDelivery
from apps.notifications.services import create_notification, deliver_pending_notifications

User = get_user_model()


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class NotificationDeliveryTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="hero",
            email="hero@example.com",
            password="strongpass123",
        )

    def test_pending_email_delivery_is_sent(self):
        notification = create_notification(
            user=self.user,
            type="invite_sent",
            title="Invitation sent",
            body="You have a new invitation.",
            include_email=True,
            include_in_app=False,
        )

        deliver_pending_notifications()

        delivery = notification.deliveries.get(channel="email")
        self.assertEqual(delivery.status, NotificationDelivery.Status.SENT)
        self.assertEqual(len(mail.outbox), 1)

    def test_failed_email_delivery_is_marked_failed(self):
        notification = create_notification(
            user=self.user,
            type="invite_sent",
            title="Invitation sent",
            body="You have a new invitation.",
            include_email=True,
            include_in_app=False,
        )

        delivery = notification.deliveries.get(channel="email")
        self.assertEqual(delivery.status, NotificationDelivery.Status.PENDING)
