from rest_framework import generics, mixins, viewsets

from .models import Notification, NotificationPreference
from .serializers import NotificationPreferenceSerializer, NotificationReadSerializer, NotificationSerializer


class NotificationViewSet(mixins.ListModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "update" or self.action == "partial_update":
            return NotificationReadSerializer
        return NotificationSerializer


class NotificationPreferenceView(generics.RetrieveUpdateAPIView):
    serializer_class = NotificationPreferenceSerializer

    def get_object(self):
        preferences, _ = NotificationPreference.objects.get_or_create(user=self.request.user)
        return preferences

