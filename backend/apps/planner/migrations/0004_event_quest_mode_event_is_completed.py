from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("planner", "0002_event_category"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="is_completed",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="event",
            name="quest_mode",
            field=models.CharField(
                choices=[("solo", "Solo"), ("group", "Group")],
                default="solo",
                max_length=20,
            ),
        ),
    ]
