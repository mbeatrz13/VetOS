from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import LoginView, RegisterView, LogoutView, UserViewSet, AccessLogViewSet

router = DefaultRouter()
router.register(r"users",       UserViewSet,      basename="user")
router.register(r"access-logs", AccessLogViewSet, basename="access-log")

urlpatterns = [
    # Autenticação
    path("login/",         LoginView.as_view(),    name="accounts-login"),
    path("register/",      RegisterView.as_view(), name="accounts-register"),
    path("logout/",        LogoutView.as_view(),   name="accounts-logout"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),

    # CRUD de usuários + logs
    *router.urls,
]