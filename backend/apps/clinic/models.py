from django.db import models
from apps.reception.models import Animal, Veterinarian, Appointment


class MedicalRecord(models.Model):
    """
    Prontuário: um por animal, criado no primeiro atendimento.
    """
    animal       = models.OneToOneField(Animal, on_delete=models.CASCADE, related_name='medical_record')
    created_at   = models.DateField(auto_now_add=True)
    general_notes = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'medical_record'

    def __str__(self):
        return f'Record #{self.pk} — {self.animal.name}'


class Consultation(models.Model):
    """
    Atendimento clínico vinculado ao prontuário.
    """
    class ConsultationType(models.TextChoices):
        CONSULTATION = 'consultation', 'Consultation'
        FOLLOW_UP    = 'follow_up',    'Follow-up'
        SURGERY      = 'surgery',      'Surgery'
        VACCINE      = 'vaccine',      'Vaccine'
        EMERGENCY    = 'emergency',    'Emergency'

    class Status(models.TextChoices):
        IN_PROGRESS = 'in_progress', 'In Progress'
        COMPLETED   = 'completed',   'Completed'
        CANCELLED   = 'cancelled',   'Cancelled'

    medical_record   = models.ForeignKey(MedicalRecord, on_delete=models.CASCADE, related_name='consultations')
    veterinarian     = models.ForeignKey(Veterinarian, on_delete=models.PROTECT, related_name='consultations')
    appointment      = models.ForeignKey(Appointment, null=True, blank=True, on_delete=models.SET_NULL)
    datetime         = models.DateTimeField(auto_now_add=True)
    type             = models.CharField(max_length=20, choices=ConsultationType)
    status           = models.CharField(max_length=20, choices=Status, default=Status.IN_PROGRESS)
    symptoms         = models.TextField(null=True, blank=True)
    diagnosis        = models.TextField(null=True, blank=True)
    request_date     = models.DateField(null=True, blank=True)
    result_date      = models.DateField(null=True, blank=True)
    result_file      = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        db_table = 'consultation'
        ordering = ['-datetime']

    def __str__(self):
        return f'Consultation #{self.pk} — {self.medical_record.animal.name}'


class Exam(models.Model):
    """
    Exame solicitado dentro de um atendimento.
    """
    class Status(models.TextChoices):
        REQUESTED   = 'requested',   'Requested'
        COLLECTED   = 'collected',   'Collected'
        PROCESSING  = 'processing',  'Processing'
        COMPLETED   = 'completed',   'Completed'
        CANCELLED   = 'cancelled',   'Cancelled'

    consultation     = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='exams')
    exam_type        = models.CharField(max_length=100)
    status           = models.CharField(max_length=20, choices=Status, default=Status.REQUESTED)
    notes            = models.TextField(null=True, blank=True)
    results          = models.TextField(null=True, blank=True)
    request_date     = models.DateField(auto_now_add=True)
    result_date      = models.DateField(null=True, blank=True)
    result_file      = models.CharField(max_length=500, null=True, blank=True)

    class Meta:
        db_table = 'exam'
        ordering = ['-request_date']

    def __str__(self):
        return f'{self.exam_type} — {self.status}'


class Prescription(models.Model):
    """
    Prescrição de medicamento gerada em um atendimento.
    """
    from apps.inventory.models import Product
    consultation = models.ForeignKey(Consultation, on_delete=models.CASCADE, related_name='prescriptions')
    product      = models.ForeignKey('inventory.Product', on_delete=models.PROTECT)
    medication   = models.CharField(max_length=200)
    dosage       = models.CharField(max_length=100)
    frequency    = models.CharField(max_length=100)
    duration     = models.CharField(max_length=100)
    instructions = models.TextField(null=True, blank=True)
    issued_at    = models.DateField(auto_now_add=True)

    class Meta:
        db_table = 'prescription'
        ordering = ['-issued_at']

    def __str__(self):
        return f'{self.medication} — {self.consultation.medical_record.animal.name}'
