from django.utils import timezone
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Employee, Veterinarian, Receptionist, Specialty, Tutor, Animal, Appointment
from .serializers import (
    EmployeeSerializer, VeterinarianSerializer, ReceptionistSerializer,
    SpecialtySerializer, TutorSerializer, AnimalSerializer, AppointmentSerializer,
)


class SpecialtyViewSet(viewsets.ModelViewSet):
    """
    GET    /api/reception/specialties/
    POST   /api/reception/specialties/
    GET    /api/reception/specialties/{id}/
    PUT    /api/reception/specialties/{id}/
    DELETE /api/reception/specialties/{id}/
    """
    queryset         = Specialty.objects.all().order_by('name')
    serializer_class = SpecialtySerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    """
    GET    /api/reception/employees/            → lista (search: name, role)
    POST   /api/reception/employees/
    GET    /api/reception/employees/{id}/
    PUT    /api/reception/employees/{id}/
    DELETE /api/reception/employees/{id}/
    """
    queryset         = Employee.objects.select_related('user').all().order_by('name')
    serializer_class = EmployeeSerializer
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['name', 'role', 'email']


class VeterinarianViewSet(viewsets.ModelViewSet):
    """
    GET  /api/reception/veterinarians/
    GET  /api/reception/veterinarians/{id}/
    GET  /api/reception/veterinarians/{id}/schedule/  → agenda futura
    """
    queryset = Veterinarian.objects.select_related('employee').prefetch_related('specialties').all()
    serializer_class = VeterinarianSerializer

    @action(detail=True, methods=['get'])
    def schedule(self, request, pk=None):
        """Próximos agendamentos do veterinário."""
        vet   = self.get_object()
        today = timezone.now().date()
        qs    = vet.appointments.filter(date__gte=today).exclude(
            status__in=['cancelled', 'no_show']
        ).order_by('date', 'time')
        return Response(AppointmentSerializer(qs, many=True).data)


class ReceptionistViewSet(viewsets.ModelViewSet):
    """
    GET  /api/reception/receptionists/
    GET  /api/reception/receptionists/{id}/
    """
    queryset         = Receptionist.objects.select_related('employee').all()
    serializer_class = ReceptionistSerializer


class TutorViewSet(viewsets.ModelViewSet):
    """
    GET    /api/reception/tutors/              → lista (search: name, email, phone)
    POST   /api/reception/tutors/
    GET    /api/reception/tutors/{id}/
    PUT    /api/reception/tutors/{id}/
    DELETE /api/reception/tutors/{id}/
    GET    /api/reception/tutors/{id}/animals/ → animais do tutor
    """
    queryset         = Tutor.objects.all().order_by('name')
    serializer_class = TutorSerializer
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['name', 'email', 'phone']

    @action(detail=True, methods=['get'])
    def animals(self, request, pk=None):
        tutor   = self.get_object()
        animals = tutor.animals.filter(active=True)
        return Response(AnimalSerializer(animals, many=True).data)


class AnimalViewSet(viewsets.ModelViewSet):
    """
    GET    /api/reception/animals/              → lista (search: name, species, tutor)
    POST   /api/reception/animals/
    GET    /api/reception/animals/{id}/
    PUT    /api/reception/animals/{id}/
    DELETE /api/reception/animals/{id}/
    GET    /api/reception/animals/{id}/history/ → atendimentos do animal
    """
    queryset        = Animal.objects.select_related('tutor').all().order_by('name')
    filter_backends = [filters.SearchFilter]
    search_fields   = ['name', 'species', 'breed', 'tutor__name']

    def get_serializer_class(self):
        return AnimalSerializer

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        from apps.clinic.models import MedicalRecord
        from apps.clinic.serializers import ConsultationSerializer
        animal = self.get_object()
        try:
            record       = animal.medical_record
            consultations = record.consultations.order_by('-datetime')
            from apps.clinic.serializers import ConsultationSerializer
            return Response(ConsultationSerializer(consultations, many=True).data)
        except MedicalRecord.DoesNotExist:
            return Response({'detail': 'No medical record found.'}, status=404)


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    GET    /api/reception/appointments/         → lista (filtros: date, vet, status)
    POST   /api/reception/appointments/
    GET    /api/reception/appointments/{id}/
    PUT    /api/reception/appointments/{id}/
    DELETE /api/reception/appointments/{id}/
    GET    /api/reception/appointments/today/   → agenda do dia
    """
    queryset = Appointment.objects.select_related(
        'animal__tutor', 'veterinarian__employee', 'receptionist__employee'
    ).all()
    serializer_class = AppointmentSerializer
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['animal__name', 'animal__tutor__name', 'veterinarian__employee__name', 'status', 'type']

    def get_queryset(self):
        qs     = super().get_queryset()
        date   = self.request.query_params.get('date')
        vet    = self.request.query_params.get('veterinarian')
        status = self.request.query_params.get('status')
        if date:
            qs = qs.filter(date=date)
        if vet:
            qs = qs.filter(veterinarian_id=vet)
        if status:
            qs = qs.filter(status=status)
        return qs

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        qs    = self.get_queryset().filter(date=today)
        return Response(AppointmentSerializer(qs, many=True).data)
