from django.utils import timezone
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import User, AccessLog
from .permissions import IsAdmin, IsAnyAuthenticated
from .serializers import (
    UserSerializer,
    UserWriteSerializer,
    ChangePasswordSerializer,
    AccessLogSerializer,
)


def _get_client_ip(request):
    x_forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded:
        return x_forwarded.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginView(APIView):
    """
    POST /api/accounts/login/
    Body: { "username": "...", "password": "..." }
    Retorna access + refresh token e dados básicos do usuário.
    Registra tentativa no AccessLog.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username", "").strip()
        password = request.data.get("password", "")

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            user = None

        ip         = _get_client_ip(request)
        user_agent = request.META.get("HTTP_USER_AGENT", "")

        # Usuário existe mas está bloqueado/inativo
        if user and user.state != User.State.ACTIVE:
            AccessLog.objects.create(user=user, success=False, ip=ip, user_agent=user_agent)
            return Response(
                {"detail": "Conta inativa ou bloqueada."},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Credenciais inválidas
        if not user or not user.check_password(password):
            if user:
                AccessLog.objects.create(user=user, success=False, ip=ip, user_agent=user_agent)
            return Response(
                {"detail": "Credenciais inválidas."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Login OK
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])
        AccessLog.objects.create(user=user, success=True, ip=ip, user_agent=user_agent)

        refresh = RefreshToken.for_user(user)
        # Adiciona role ao payload do token (útil pro frontend)
        refresh["role"] = user.role

        return Response({
            "access":  str(refresh.access_token),
            "refresh": str(refresh),
            "user": {
                "id":       user.pk,
                "username": user.username,
                "role":     user.role,
            },
        })


class LogoutView(APIView):
    """
    POST /api/accounts/logout/
    Body: { "refresh": "<refresh_token>" }
    Coloca o refresh token na blacklist (invalida a sessão).
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response(
                {"detail": "Refresh token é obrigatório."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Logout realizado com sucesso."})


# ── Usuários ──────────────────────────────────────────────────────────────────

class UserViewSet(viewsets.ModelViewSet):
    """
    Gerenciamento de usuários do sistema. Restrito a administradores.

    GET    /api/accounts/users/                → lista paginada
    POST   /api/accounts/users/                → criar usuário
    GET    /api/accounts/users/{id}/           → detalhe
    PUT    /api/accounts/users/{id}/           → atualizar
    PATCH  /api/accounts/users/{id}/           → atualizar parcial
    DELETE /api/accounts/users/{id}/           → remover
    POST   /api/accounts/users/{id}/block/     → bloquear
    POST   /api/accounts/users/{id}/activate/  → ativar
    POST   /api/accounts/users/me/change_password/ → trocar própria senha
    """
    queryset            = User.objects.all().order_by("username")
    permission_classes  = [IsAdmin]
    filter_backends     = [filters.SearchFilter]
    search_fields       = ["username", "role", "state"]

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return UserWriteSerializer
        return UserSerializer

    # Trocar senha do próprio usuário (qualquer perfil autenticado)
    @action(
        detail=False,
        methods=["post"],
        url_path="me/change_password",
        permission_classes=[IsAuthenticated],
    )
    def change_password(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save(update_fields=["password"])
        return Response({"detail": "Senha alterada com sucesso."})

    @action(detail=True, methods=["post"], permission_classes=[IsAdmin])
    def block(self, request, pk=None):
        user = self.get_object()
        if user == request.user:
            return Response(
                {"detail": "Você não pode bloquear a si mesmo."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.state = User.State.BLOCKED
        user.save(update_fields=["state"])
        return Response({"detail": f"Usuário '{user.username}' bloqueado."})

    @action(detail=True, methods=["post"], permission_classes=[IsAdmin])
    def activate(self, request, pk=None):
        user = self.get_object()
        user.state = User.State.ACTIVE
        user.save(update_fields=["state"])
        return Response({"detail": f"Usuário '{user.username}' ativado."})


# ── Logs de acesso ────────────────────────────────────────────────────────────

class AccessLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Log de tentativas de login. Somente administradores.

    GET /api/accounts/access-logs/          → lista (filtros: ?user=id&success=true)
    GET /api/accounts/access-logs/{id}/     → detalhe
    """
    queryset           = AccessLog.objects.select_related("user").all()
    serializer_class   = AccessLogSerializer
    permission_classes = [IsAdmin]
    filter_backends    = [filters.SearchFilter]
    search_fields      = ["user__username", "ip"]

    def get_queryset(self):
        qs = super().get_queryset()
        user_id = self.request.query_params.get("user")
        success = self.request.query_params.get("success")
        if user_id:
            qs = qs.filter(user_id=user_id)
        if success is not None:
            qs = qs.filter(success=success in ("true", "1"))
        return qs