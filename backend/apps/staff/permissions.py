from rest_framework.permissions import BasePermission
from .services import get_role


class IsStaffMember(BasePermission):
    def has_permission(self, request, view):
        return get_role(request.user) is not None
