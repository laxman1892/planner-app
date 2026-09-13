from rest_framework import permissions, viewsets

from .models import Event, EventParticipant
from .permissions import IsEventOwnerOrReadOnly, IsInvitationCreatorOrInviteeReadOnly
from .serializers import EventParticipantSerializer, EventSerializer
from .services import notify_invitation_response, visible_event_participants_for_user, visible_events_for_user


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = [permissions.IsAuthenticated, IsEventOwnerOrReadOnly]

    def get_queryset(self):
        return visible_events_for_user(self.request.user)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


class EventParticipantViewSet(viewsets.ModelViewSet):
    serializer_class = EventParticipantSerializer
    permission_classes = [permissions.IsAuthenticated, IsInvitationCreatorOrInviteeReadOnly]

    def get_queryset(self):
        return visible_event_participants_for_user(self.request.user)

    def perform_create(self, serializer):
        serializer.save()

    def perform_update(self, serializer):
        invitation = serializer.save()
        notify_invitation_response(invitation)
