from rest_framework import generics

from .serializers import ProgressSummarySerializer
from .services import get_progress_summary


class MyProgressView(generics.RetrieveAPIView):
    serializer_class = ProgressSummarySerializer

    def get_object(self):
        return get_progress_summary(self.request.user)

