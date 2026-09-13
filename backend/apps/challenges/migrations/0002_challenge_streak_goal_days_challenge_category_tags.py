from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("challenges", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="challenge",
            name="category_tags",
            field=models.JSONField(blank=True, default=list),
        ),
        migrations.AddField(
            model_name="challenge",
            name="streak_goal_days",
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]
