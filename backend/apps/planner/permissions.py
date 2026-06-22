from rest_framework import permissions


class IsEventOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.creator_id == request.user.id


class IsInvitationCreatorOrInviteeReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return obj.user_id == request.user.id or obj.event.creator_id == request.user.id

        if request.method in ("PUT", "PATCH"):
            return obj.user_id == request.user.id

        return obj.event.creator_id == request.user.id
