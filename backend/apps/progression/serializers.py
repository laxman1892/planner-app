from rest_framework import serializers


class ProgressSummarySerializer(serializers.Serializer):
    total_xp = serializers.IntegerField()
    level = serializers.IntegerField()
    next_level_xp = serializers.IntegerField()

