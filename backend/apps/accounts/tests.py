import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


@pytest.mark.django_db
class TestLoginView:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123",
            role=User.Role.RECEPTIONIST,
        )

    def test_login_valid_credentials(self):
        response = self.client.post(
            "/api/accounts/login/",
            {"username": "testuser", "password": "testpass123"},
        )
        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["user"]["username"] == "testuser"

    def test_login_invalid_credentials(self):
        response = self.client.post(
            "/api/accounts/login/",
            {"username": "testuser", "password": "wrongpass"},
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "detail" in response.data

    def test_login_inactive_user(self):
        self.user.state = User.State.INACTIVE
        self.user.save()
        response = self.client.post(
            "/api/accounts/login/",
            {"username": "testuser", "password": "testpass123"},
        )
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestRegisterView:
    def setup_method(self):
        self.client = APIClient()

    def test_register_valid(self):
        response = self.client.post(
            "/api/accounts/register/",
            {
                "username": "newuser",
                "email": "new@example.com",
                "password": "SecurePass123!",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["user"]["username"] == "newuser"
        assert User.objects.filter(username="newuser").exists()

    def test_register_duplicate_username(self):
        User.objects.create_user(
            username="existing",
            password="pass123",
            role=User.Role.RECEPTIONIST,
        )
        response = self.client.post(
            "/api/accounts/register/",
            {
                "username": "existing",
                "email": "new@example.com",
                "password": "SecurePass123!",
            },
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_duplicate_email(self):
        User.objects.create_user(
            username="user1",
            email="same@example.com",
            password="pass123",
            role=User.Role.RECEPTIONIST,
        )
        response = self.client.post(
            "/api/accounts/register/",
            {
                "username": "user2",
                "email": "same@example.com",
                "password": "SecurePass123!",
            },
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_weak_password(self):
        response = self.client.post(
            "/api/accounts/register/",
            {
                "username": "newuser",
                "email": "new@example.com",
                "password": "123",
            },
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogoutView:
    def setup_method(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            password="testpass123",
            role=User.Role.RECEPTIONIST,
        )

    def test_logout_valid(self):
        # Login first to get tokens
        login_response = self.client.post(
            "/api/accounts/login/",
            {"username": "testuser", "password": "testpass123"},
        )
        refresh_token = login_response.data["refresh"]

        # Set auth header
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )

        # Logout
        response = self.client.post(
            "/api/accounts/logout/",
            {"refresh": refresh_token},
        )
        assert response.status_code == status.HTTP_200_OK

    def test_logout_missing_token(self):
        login_response = self.client.post(
            "/api/accounts/login/",
            {"username": "testuser", "password": "testpass123"},
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}"
        )

        response = self.client.post("/api/accounts/logout/", {})
        assert response.status_code == status.HTTP_400_BAD_REQUEST
