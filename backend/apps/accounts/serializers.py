from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User, AccessLog


# ── Leitura ──────────────────────────────────────────────────────────────────

class UserSerializer(serializers.ModelSerializer):
    """Serializer somente-leitura (listagem/detalhe)."""

    class Meta:
        model  = User
        fields = ["id", "username", "role", "state", "last_login"]
        read_only_fields = fields


# ── Criação / Atualização ─────────────────────────────────────────────────────

class UserWriteSerializer(serializers.ModelSerializer):
    """Cria ou atualiza um usuário. Senha é sempre write-only."""
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
    )

    class Meta:
        model  = User
        fields = ["id", "username", "password", "role", "state"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


# ── Alteração de senha ────────────────────────────────────────────────────────

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True, required=True)
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
    )

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Senha atual incorreta.")
        return value


# ── Log de acesso ─────────────────────────────────────────────────────────────

class AccessLogSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model  = AccessLog
        fields = ["id", "username", "timestamp", "success", "ip", "user_agent"]
        read_only_fields = fields