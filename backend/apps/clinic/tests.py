import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from datetime import datetime, timedelta
from django.utils import timezone
from apps.reception.models import (
    Employee, Veterinarian, Receptionist, Specialty, Tutor, Animal, Appointment
)
from apps.clinic.models import MedicalRecord, Consultation, Exam
from apps.inventory.models import Product

User = get_user_model()


@pytest.fixture
def clinic_setup(db):
    """Fixture to set up clinic-related objects."""
    tutor = Tutor.objects.create(name="João Silva")
    animal = Animal.objects.create(tutor=tutor, name="Bolinha", species="Cachorro")
    medical_record = MedicalRecord.objects.create(animal=animal)

    vet_user = User.objects.create_user(
        username="vet", password="vet123", role=User.Role.VET
    )
    employee = Employee.objects.create(user=vet_user, name="Dr. Test")
    vet = Veterinarian.objects.create(employee=employee, crmv="123456/SP")

    appointment = Appointment.objects.create(
        animal=animal,
        veterinarian=vet,
        date=timezone.now().date() + timedelta(days=1),
        time="14:00",
        type="consultation",
    )

    return {
        "tutor": tutor,
        "animal": animal,
        "medical_record": medical_record,
        "vet": vet,
        "appointment": appointment,
    }


@pytest.mark.django_db
class TestMedicalRecordCRUD:
    def test_list_medical_records(self, clinic_setup):
        client = APIClient()
        response = client.get("/api/clinic/medical-records/")
        assert response.status_code == status.HTTP_200_OK

    def test_get_medical_record_detail(self, clinic_setup):
        client = APIClient()
        record = clinic_setup["medical_record"]
        response = client.get(f"/api/clinic/medical-records/{record.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["animal"] == clinic_setup["animal"].id


@pytest.mark.django_db
class TestConsultationCRUD:
    def test_list_consultations(self, clinic_setup):
        client = APIClient()
        response = client.get("/api/clinic/consultations/")
        assert response.status_code == status.HTTP_200_OK

    def test_create_consultation(self, clinic_setup):
        client = APIClient()
        admin = User.objects.create_user(
            username="admin", password="admin123", role=User.Role.ADMIN
        )
        client.force_authenticate(user=admin)

        response = client.post(
            "/api/clinic/consultations/",
            {
                "medical_record": clinic_setup["medical_record"].id,
                "veterinarian": clinic_setup["vet"].id,
                "consultation_type": "initial",
                "symptoms": "Dor na pata",
                "diagnosis": "Inflamação",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Consultation.objects.filter(
            medical_record=clinic_setup["medical_record"]
        ).exists()

    def test_get_consultation_detail(self, clinic_setup):
        medical_record = clinic_setup["medical_record"]
        vet = clinic_setup["vet"]
        consultation = Consultation.objects.create(
            medical_record=medical_record,
            veterinarian=vet,
            consultation_type="initial",
            symptoms="Dor na pata",
        )

        client = APIClient()
        response = client.get(f"/api/clinic/consultations/{consultation.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["symptoms"] == "Dor na pata"


@pytest.mark.django_db
class TestExamCRUD:
    def test_list_exams(self, clinic_setup):
        client = APIClient()
        response = client.get("/api/clinic/exams/")
        assert response.status_code == status.HTTP_200_OK

    def test_create_exam(self, clinic_setup):
        client = APIClient()
        admin = User.objects.create_user(
            username="admin", password="admin123", role=User.Role.ADMIN
        )
        client.force_authenticate(user=admin)

        medical_record = clinic_setup["medical_record"]
        vet = clinic_setup["vet"]
        consultation = Consultation.objects.create(
            medical_record=medical_record,
            veterinarian=vet,
            consultation_type="initial",
        )

        response = client.post(
            "/api/clinic/exams/",
            {
                "consultation": consultation.id,
                "exam_type": "blood_test",
                "notes": "Coleta de sangue",
            },
        )
        assert response.status_code == status.HTTP_201_CREATED
        assert Exam.objects.filter(consultation=consultation).exists()

    def test_get_exam_detail(self, clinic_setup):
        medical_record = clinic_setup["medical_record"]
        vet = clinic_setup["vet"]
        consultation = Consultation.objects.create(
            medical_record=medical_record,
            veterinarian=vet,
            consultation_type="initial",
        )
        exam = Exam.objects.create(
            consultation=consultation,
            exam_type="blood_test",
            notes="Coleta de sangue",
        )

        client = APIClient()
        response = client.get(f"/api/clinic/exams/{exam.id}/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data["exam_type"] == "blood_test"
