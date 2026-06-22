from rest_framework import permissions


class IsChallengeOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        owner_id = getattr(obj, "creator_id", None)

        if owner_id is None and hasattr(obj, "challenge"):
            owner_id = obj.challenge.creator_id

        return owner_id == request.user.id
