import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import datetime, timedelta
from django.utils import timezone
from apps.reception.models import (
    Employee, Veterinarian, Receptionist, Specialty, Tutor, Animal, Appointment
)

User = get_user_model()


@pytest.fixture
def admin_user(db):
    user = User.objects.create_user(
        username="admin",
        password="admin123",
        role=User.Role.ADMIN,
    )
    return user


@pytest.fixture
def vet_user(db):
    user = User.objects.create_user(
        username="vet",
        password="vet123",
        role=User.Role.VET,
    )
    employee = Employee.objects.create(user=user, name="Dr. Test")
    specialty = Specialty.objects.create(name="Cirurgia")
    vet = Veterinarian.objects.create(employee=employee, crmv="123456/SP")
    vet.specialties.add(specialty)
    return user


@pytest.fixture
def receptionist_user(db):
    user = User.objects.create_user(
        username="rec",
        password="rec123",
        role=User.Role.RECEPTIONIST,
    )
    employee = Employee.objects.create(user=user, name="Maria")
    Receptionist.objects.create(employee=employee)
    return user


@pytest.mark.django_db
class TestTutorCRUD:
    def setup_method(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username="admin", password="admin123", role=User.Role.ADMIN
        )

    def test_list_tutors(self):
        Tutor.objects.create(name="João Silva", email="joao@example.com")
        Tutor.objects.create(name="Maria Santos", email="maria@example.com")

        response = self.client.get("/api/reception/tutors/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_create_tutor(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(
            "/api/reception/tutors/",
            {
                "name": "João Silva",
                "email": "joao@example.com",
                "phone": "11-99999-0001",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Tutor.objects.filter(name="João Silva").exists()

    def test_get_tutor_detail(self):
        tutor = Tutor.objects.create(name="João Silva", email="joao@example.com")
        response = self.client.get(f"/api/reception/tutors/{tutor.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == "João Silva"


@pytest.mark.django_db
class TestAnimalCRUD:
    def setup_method(self):
        self.client = APIClient()
        self.tutor = Tutor.objects.create(name="João Silva")

    def test_list_animals(self):
        Animal.objects.create(
            tutor=self.tutor, name="Bolinha", species="Cachorro"
        )
        Animal.objects.create(
            tutor=self.tutor, name="Miau", species="Gato"
        )

        response = self.client.get("/api/reception/animals/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_create_animal(self):
        admin = User.objects.create_user(
            username="admin", password="admin123", role=User.Role.ADMIN
        )
        self.client.force_authenticate(user=admin)

        response = self.client.post(
            "/api/reception/animals/",
            {
                "tutor": self.tutor.id,
                "name": "Bolinha",
                "species": "Cachorro",
                "breed": "Poodle",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Animal.objects.filter(name="Bolinha").exists()


@pytest.mark.django_db
class TestAppointmentCRUD:
    def setup_method(self):
        self.client = APIClient()
        self.tutor = Tutor.objects.create(name="João Silva")
        self.animal = Animal.objects.create(
            tutor=self.tutor, name="Bolinha", species="Cachorro"
        )

        # Create vet
        vet_user = User.objects.create_user(
            username="vet", password="vet123", role=User.Role.VET
        )
        employee = Employee.objects.create(user=vet_user, name="Dr. Test")
        self.vet = Veterinarian.objects.create(employee=employee, crmv="123456/SP")

        # Create receptionist
        rec_user = User.objects.create_user(
            username="rec", password="rec123", role=User.Role.RECEPTIONIST
        )
        rec_employee = Employee.objects.create(user=rec_user, name="Maria")
        self.receptionist = Receptionist.objects.create(employee=rec_employee)

    def test_list_appointments(self):
        date = timezone.now().date() + timedelta(days=1)
        Appointment.objects.create(
            animal=self.animal,
            veterinarian=self.vet,
            date=date,
            time="14:00",
            type="consultation",
        )

        response = self.client.get("/api/reception/appointments/")
        assert response.status_code == status.HTTP_200_OK

    def test_create_appointment(self):
        admin = User.objects.create_user(
            username="admin", password="admin123", role=User.Role.ADMIN
        )
        self.client.force_authenticate(user=admin)

        date = timezone.now().date() + timedelta(days=1)
        response = self.client.post(
            "/api/reception/appointments/",
            {
                "animal": self.animal.id,
                "veterinarian": self.vet.id,
                "date": date,
                "time": "14:00",
                "type": "consultation",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Appointment.objects.filter(animal=self.animal).exists()
