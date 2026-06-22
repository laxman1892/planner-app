from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from apps.accounts.views import EmailOrUsernameTokenObtainPairView, RegisterView, UserProfileView
from apps.achievements.views import AchievementViewSet
from apps.challenges.views import ChallengeProgressViewSet, ChallengeViewSet
from apps.planner.views import EventParticipantViewSet, EventViewSet

router = DefaultRouter()
router.register("events", EventViewSet, basename="event")
router.register("event-participants", EventParticipantViewSet, basename="event-participant")
router.register("event-invitations", EventParticipantViewSet, basename="event-invitation")
router.register("challenges", ChallengeViewSet, basename="challenge")
router.register("progress", ChallengeProgressViewSet, basename="challenge-progress")
router.register("achievements", AchievementViewSet, basename="achievement")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/register/", RegisterView.as_view(), name="register"),
    path("api/auth/token/", EmailOrUsernameTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/auth/me/", UserProfileView.as_view(), name="profile"),
    path("api/", include(router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
