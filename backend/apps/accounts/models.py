from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, username, password=None, role=None, **extra_fields):
        if not username:
            raise ValueError("Username é obrigatório.")
        user = self.model(username=username, role=role, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault("role", User.Role.ADMIN)
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(username, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Usuário do sistema (credenciais de login).
    Separado de Employee para que dados pessoais e acesso sejam gerenciados
    de forma independente.
    """

    class State(models.TextChoices):
        ACTIVE   = "active",   "Ativo"
        INACTIVE = "inactive", "Inativo"
        BLOCKED  = "blocked",  "Bloqueado"

    class Role(models.TextChoices):
        ADMIN        = "admin",        "Administrador"
        VET          = "vet",          "Veterinário"
        RECEPTIONIST = "receptionist", "Recepcionista"

    username   = models.CharField(max_length=150, unique=True)
    state      = models.CharField(max_length=20, choices=State, default=State.ACTIVE)
    role       = models.CharField(max_length=20, choices=Role)
    is_staff   = models.BooleanField(default=False)   # acesso ao Django Admin

    # AbstractBaseUser já fornece: password, last_login, is_active
    # PermissionsMixin já fornece: is_superuser, groups, user_permissions

    objects = UserManager()

    USERNAME_FIELD  = "username"
    REQUIRED_FIELDS = ["role"]

    class Meta:
        db_table = "user"

    def __str__(self):
        return f"{self.username} ({self.role})"

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    @property
    def is_vet(self):
        return self.role == self.Role.VET

    @property
    def is_receptionist(self):
        return self.role == self.Role.RECEPTIONIST


class AccessLog(models.Model):
    """
    Registro de tentativas de login (sucesso e falha).
    """
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="access_logs")
    timestamp  = models.DateTimeField(auto_now_add=True)
    success    = models.BooleanField()
    ip         = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "access_log"
        ordering = ["-timestamp"]

    def __str__(self):
        status = "OK" if self.success else "FALHA"
        return f"{status} — {self.user.username} @ {self.timestamp}"