from django.contrib import admin
from .models import User, AccessLog


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "username",
        "role",
        "state",
        "is_staff",
        "is_superuser",
    )

    list_filter = (
        "role",
        "state",
        "is_staff",
        "is_superuser",
    )

    search_fields = ("username",)


@admin.register(AccessLog)
class AccessLogAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "success",
        "ip",
        "timestamp",
    )

    list_filter = (
        "success",
        "timestamp",
    )

    search_fields = (
        "user__username",
        "ip",
    )

    readonly_fields = (
        "timestamp",
    )