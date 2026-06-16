from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import MedicalRecord, Consultation, Exam, Prescription
from .serializers import (
    MedicalRecordSerializer,
    MedicalRecordDetailSerializer,
    ConsultationSerializer,
    ConsultationWriteSerializer,
    ExamSerializer,
    PrescriptionSerializer,
)


class MedicalRecordViewSet(viewsets.ModelViewSet):
    """
    Prontuário — um registro por animal.

    GET  /api/clinic/medical-records/            → lista
    POST /api/clinic/medical-records/            → cria
    GET  /api/clinic/medical-records/{id}/       → detalhe simples
    GET  /api/clinic/medical-records/{id}/full/  → detalhe com todas as consultas
    """
    queryset = (
        MedicalRecord.objects
        .select_related('animal__tutor')
        .order_by('-created_at')
    )
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

    GET   /api/clinic/consultations/                  → lista
    POST  /api/clinic/consultations/                  → abre atendimento
    GET   /api/clinic/consultations/{id}/             → detalhe
    PATCH /api/clinic/consultations/{id}/             → atualiza
    DELETE /api/clinic/consultations/{id}/            → remove
    PATCH /api/clinic/consultations/{id}/complete/    → finaliza atendimento
    PATCH /api/clinic/consultations/{id}/cancel/      → cancela atendimento
    """
    queryset = (
        Consultation.objects
        .select_related(
            'medical_record__animal__tutor',
            'veterinarian__employee',
        )
        .prefetch_related('exams', 'prescriptions')
        .order_by('-datetime')
    )
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'type', 'veterinarian']
    search_fields    = [
        'medical_record__animal__name',
        'medical_record__animal__tutor__name',
        'veterinarian__employee__name',
        'diagnosis',
    ]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return ConsultationWriteSerializer
        return ConsultationSerializer

    def get_queryset(self):
        qs     = super().get_queryset()
        animal = self.request.query_params.get('animal')
        if animal:
            qs = qs.filter(medical_record__animal_id=animal)
        return qs

    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        """
        Finaliza um atendimento em andamento.
        Body (opcional): { "diagnosis": "..." }
        """
        consultation = self.get_object()

        if consultation.status != Consultation.Status.IN_PROGRESS:
            return Response(
                {'detail': "Apenas atendimentos 'in_progress' podem ser concluídos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        diagnosis = request.data.get('diagnosis')
        if diagnosis:
            consultation.diagnosis = diagnosis

        consultation.status = Consultation.Status.COMPLETED
        consultation.save()
        return Response(ConsultationSerializer(consultation).data)

    @action(detail=True, methods=['patch'])
    def cancel(self, request, pk=None):
        """Cancela um atendimento."""
        consultation = self.get_object()

        if consultation.status == Consultation.Status.COMPLETED:
            return Response(
                {'detail': "Atendimentos concluídos não podem ser cancelados."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        consultation.status = Consultation.Status.CANCELLED
        consultation.save()
        return Response(ConsultationSerializer(consultation).data)


class ExamViewSet(viewsets.ModelViewSet):
    """
    Exames clínicos.

    GET   /api/clinic/exams/                    → lista
    POST  /api/clinic/exams/                    → solicita exame
    GET   /api/clinic/exams/{id}/               → detalhe
    PATCH /api/clinic/exams/{id}/               → atualiza
    PATCH /api/clinic/exams/{id}/complete/      → registra resultado
    """
    queryset = (
        Exam.objects
        .select_related('consultation__medical_record__animal')
        .order_by('-request_date')
    )
    serializer_class = ExamSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'consultation']
    search_fields    = ['exam_type', 'consultation__medical_record__animal__name']

    @action(detail=True, methods=['patch'])
    def complete(self, request, pk=None):
        """
        Registra resultado e marca o exame como completed.
        Body: { "results": "...", "result_date": "YYYY-MM-DD", "result_file": "..." }
        """
        exam    = self.get_object()
        results = request.data.get('results')

        if exam.status == Exam.Status.CANCELLED:
            return Response(
                {'detail': "Exames cancelados não podem ser concluídos."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if exam.status == Exam.Status.COMPLETED:
            return Response(
                {'detail': "Este exame já foi concluído."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if not results:
            return Response(
                {'detail': "O campo 'results' é obrigatório para concluir o exame."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        exam.results     = results
        exam.status      = Exam.Status.COMPLETED
        exam.result_date = request.data.get('result_date') or exam.result_date
        exam.result_file = request.data.get('result_file') or exam.result_file
        exam.save()

        return Response(ExamSerializer(exam).data)


class PrescriptionViewSet(viewsets.ModelViewSet):
    """
    Prescrições médicas.

    GET  /api/clinic/prescriptions/             → lista
    POST /api/clinic/prescriptions/             → cria
    GET  /api/clinic/prescriptions/{id}/        → detalhe
    PUT  /api/clinic/prescriptions/{id}/        → atualiza
    """
    queryset = (
        Prescription.objects
        .select_related(
            'consultation__medical_record__animal',
            'product',
        )
        .order_by('-issued_at')
    )
    serializer_class = PrescriptionSerializer
    filter_backends  = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['consultation', 'product']
    search_fields    = ['medication', 'consultation__medical_record__animal__name']