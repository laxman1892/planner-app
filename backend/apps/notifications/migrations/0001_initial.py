from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Notification",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("type", models.CharField(choices=[("invite_sent", "Invite Sent"), ("invite_accepted", "Invite Accepted"), ("invite_declined", "Invite Declined"), ("event_reminder", "Event Reminder"), ("challenge_reminder", "Challenge Reminder")], max_length=40)),
                ("title", models.CharField(max_length=200)),
                ("body", models.TextField()),
                ("payload", models.JSONField(blank=True, default=dict)),
                ("read_at", models.DateTimeField(blank=True, null=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="notifications", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-created_at"]},
        ),
        migrations.CreateModel(
            name="NotificationDelivery",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("channel", models.CharField(choices=[("in_app", "In-App"), ("email", "Email")], max_length=20)),
                ("status", models.CharField(choices=[("pending", "Pending"), ("sent", "Sent"), ("failed", "Failed")], default="pending", max_length=20)),
                ("attempts", models.PositiveIntegerField(default=0)),
                ("sent_at", models.DateTimeField(blank=True, null=True)),
                ("last_error", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("notification", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="deliveries", to="notifications.notification")),
            ],
        ),
        migrations.CreateModel(
            name="NotificationPreference",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("invite_email", models.BooleanField(default=True)),
                ("invite_in_app", models.BooleanField(default=True)),
                ("event_reminder_email", models.BooleanField(default=True)),
                ("event_reminder_in_app", models.BooleanField(default=True)),
                ("challenge_reminder_email", models.BooleanField(default=True)),
                ("challenge_reminder_in_app", models.BooleanField(default=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.OneToOneField(on_delete=models.deletion.CASCADE, related_name="notification_preferences", to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
