import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.CreateModel(
            name="User",
            fields=[
                ("id",            models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("password",      models.CharField(max_length=128, verbose_name="password")),
                ("last_login",    models.DateTimeField(blank=True, null=True, verbose_name="last login")),
                ("is_superuser",  models.BooleanField(default=False)),
                ("username",      models.CharField(max_length=150, unique=True)),
                ("state",         models.CharField(
                    choices=[("active", "Ativo"), ("inactive", "Inativo"), ("blocked", "Bloqueado")],
                    default="active",
                    max_length=20,
                )),
                ("role",          models.CharField(
                    choices=[("admin", "Administrador"), ("vet", "Veterinário"), ("receptionist", "Recepcionista")],
                    max_length=20,
                )),
                ("is_staff",      models.BooleanField(default=False)),
                ("groups",        models.ManyToManyField(
                    blank=True,
                    related_name="accounts_user_set",
                    to="auth.group",
                )),
                ("user_permissions", models.ManyToManyField(
                    blank=True,
                    related_name="accounts_user_permissions_set",
                    to="auth.permission",
                )),
            ],
            options={"db_table": "user"},
        ),
        migrations.CreateModel(
            name="AccessLog",
            fields=[
                ("id",         models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("timestamp",  models.DateTimeField(auto_now_add=True)),
                ("success",    models.BooleanField()),
                ("ip",         models.GenericIPAddressField(blank=True, null=True)),
                ("user_agent", models.TextField(blank=True, null=True)),
                ("user",       models.ForeignKey(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="access_logs",
                    to="accounts.user",
                )),
            ],
            options={"db_table": "access_log", "ordering": ["-timestamp"]},
        ),
    ]