from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """Somente usuários com role=admin."""
    message = "Acesso restrito a administradores."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "admin"
        )


class IsVet(BasePermission):
    """Somente usuários com role=vet."""
    message = "Acesso restrito a veterinários."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "vet"
        )


class IsReceptionist(BasePermission):
    """Somente usuários com role=receptionist."""
    message = "Acesso restrito a recepcionistas."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == "receptionist"
        )


class IsAdminOrVet(BasePermission):
    """Admin ou veterinário — ex.: prontuários."""
    message = "Acesso restrito a administradores e veterinários."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "vet")
        )


class IsAdminOrReceptionist(BasePermission):
    """Admin ou recepcionista — ex.: agendamentos."""
    message = "Acesso restrito a administradores e recepcionistas."

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ("admin", "receptionist")
        )


class IsAnyAuthenticated(BasePermission):
    """Qualquer perfil autenticado."""
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated