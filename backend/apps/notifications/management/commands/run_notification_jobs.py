from django.core.management.base import BaseCommand

from apps.notifications.services import deliver_pending_notifications, generate_due_reminders


class Command(BaseCommand):
    help = "Generate due reminders and send pending notification emails."

    def handle(self, *args, **options):
        generate_due_reminders()
        deliver_pending_notifications()
        self.stdout.write(self.style.SUCCESS("Notification jobs complete."))
