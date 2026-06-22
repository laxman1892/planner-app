from django.contrib import admin

from .models import Challenge, ChallengeProgress

admin.site.register(Challenge)
admin.site.register(ChallengeProgress)
