from rest_framework import decorators, permissions, response, status, viewsets

from .models import Challenge, ChallengeProgress
from .permissions import IsChallengeOwner
from .serializers import ChallengeProgressSerializer, ChallengeSerializer
from .services import complete_challenge, create_self_challenge, visible_challenges_for_user, visible_progress_for_user


class ChallengeViewSet(viewsets.ModelViewSet):
    serializer_class = ChallengeSerializer
    permission_classes = [permissions.IsAuthenticated, IsChallengeOwner]

    def get_queryset(self):
        return visible_challenges_for_user(self.request.user)

    def perform_create(self, serializer):
        serializer.instance = create_self_challenge(creator=self.request.user, **serializer.validated_data)

    @decorators.action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        challenge = self.get_object()
        challenge = complete_challenge(challenge=challenge, actor=request.user)

        return response.Response(self.get_serializer(challenge).data, status=status.HTTP_200_OK)


class ChallengeProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ChallengeProgressSerializer
    permission_classes = [permissions.IsAuthenticated, IsChallengeOwner]

    def get_queryset(self):
        return visible_progress_for_user(self.request.user)
