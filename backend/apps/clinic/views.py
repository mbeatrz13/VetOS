from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import MedicalRecord, Consultation, Exam, Prescription
from .serializers import (
    MedicalRecordSerializer, MedicalRecordDetailSerializer,
    ConsultationSerializer, ExamSerializer, PrescriptionSerializer,
)


class MedicalRecordViewSet(viewsets.ModelViewSet):
    """
    Prontuário — um registro por animal.

    GET  /api/clinic/medical-records/              → lista (search: animal, tutor)
    POST /api/clinic/medical-records/
    GET  /api/clinic/medical-records/{id}/         → detalhe simples
    GET  /api/clinic/medical-records/{id}/full/    → detalhe com todas as consultas
    """
    queryset        = MedicalRecord.objects.select_related('animal__tutor').all().order_by('-created_at')
    filter_backends = [filters.SearchFilter]
    search_fields   = ['animal__name', 'animal__tutor__name', 'animal__species']

    def get_serializer_class(self):
        if self.action == 'full':
            return MedicalRecordDetailSerializer
        return MedicalRecordSerializer

    @action(detail=True, methods=['get'])
    def full(self, request, pk=None):
        """Prontuário completo com todas as consultas, exames e prescrições."""
        record = self.get_object()
        return Response(MedicalRecordDetailSerializer(record).data)


class ConsultationViewSet(viewsets.ModelViewSet):
    """
    Atendimento clínico.

    GET    /api/clinic/consultations/              → lista (filtros: animal, vet, status)
    POST   /api/clinic/consultations/
    GET    /api/clinic/consultations/{id}/
    PUT    /api/clinic/consultations/{id}/
    DELETE /api/clinic/consultations/{id}/
    """
    queryset = Consultation.objects.select_related(
        'medical_record__animal__tutor',
        'veterinarian__employee',
    ).prefetch_related('exams', 'prescriptions').all()
    serializer_class = ConsultationSerializer
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['medical_record__animal__name', 'veterinarian__employee__name', 'status', 'type']

    def get_queryset(self):
        qs     = super().get_queryset()
        animal = self.request.query_params.get('animal')
        vet    = self.request.query_params.get('veterinarian')
        status = self.request.query_params.get('status')
        if animal:
            qs = qs.filter(medical_record__animal_id=animal)
        if vet:
            qs = qs.filter(veterinarian_id=vet)
        if status:
            qs = qs.filter(status=status)
        return qs


class ExamViewSet(viewsets.ModelViewSet):
    """
    Exames clínicos.

    GET  /api/clinic/exams/                       → lista (filtro: consultation, status)
    POST /api/clinic/exams/
    GET  /api/clinic/exams/{id}/
    PUT  /api/clinic/exams/{id}/
    """
    queryset         = Exam.objects.all().order_by('-request_date')
    serializer_class = ExamSerializer

    def get_queryset(self):
        qs           = super().get_queryset()
        consultation = self.request.query_params.get('consultation')
        status       = self.request.query_params.get('status')
        if consultation:
            qs = qs.filter(consultation_id=consultation)
        if status:
            qs = qs.filter(status=status)
        return qs


class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    Prescrições médicas.

    GET  /api/clinic/prescriptions/               → lista (filtro: consultation, animal)
    POST /api/clinic/prescriptions/
    GET  /api/clinic/prescriptions/{id}/
    PUT  /api/clinic/prescriptions/{id}/
    """
    queryset         = Prescription.objects.select_related('product').all().order_by('-issued_at')
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        qs           = super().get_queryset()
        consultation = self.request.query_params.get('consultation')
        if consultation:
            qs = qs.filter(consultation_id=consultation)
        return qs
