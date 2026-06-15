from django.db import models
from apps.accounts.models import User


class Employee(models.Model):
    """
    Funcionário da clínica (veterinário ou recepcionista).
    Associado a um User para login.
    """
    class Status(models.TextChoices):
        ACTIVE   = 'active',   'Active'
        INACTIVE = 'inactive', 'Inactive'
        ON_LEAVE = 'on_leave', 'On Leave'

    user             = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employee')
    name             = models.CharField(max_length=200)
    email            = models.EmailField(null=True, blank=True)
    phone            = models.CharField(max_length=20, null=True, blank=True)
    hire_date        = models.DateField(null=True, blank=True)
    termination_date = models.DateField(null=True, blank=True)
    status           = models.CharField(max_length=20, choices=Status, default=Status.ACTIVE)

    class Meta:
        db_table = 'employee'

    def __str__(self):
        return self.name


class Veterinarian(models.Model):
    """
    Especialização de Employee: contém CRMV e especialidades.
    """
    employee      = models.OneToOneField(Employee, on_delete=models.CASCADE, primary_key=True, related_name='vet_profile')
    crmv          = models.CharField(max_length=50, unique=True)
    specialties   = models.ManyToManyField('Specialty', through='VeterinarianSpecialty', blank=True)

    class Meta:
        db_table = 'veterinarian'

    def __str__(self):
        return f'Dr(a). {self.employee.name} — {self.crmv}'


class Receptionist(models.Model):
    """
    Especialização de Employee para recepcionistas.
    """
    employee = models.OneToOneField(Employee, on_delete=models.CASCADE, primary_key=True, related_name='receptionist_profile')

    class Meta:
        db_table = 'receptionist'

    def __str__(self):
        return self.employee.name


class Specialty(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'specialty'

    def __str__(self):
        return self.name


class VeterinarianSpecialty(models.Model):
    veterinarian = models.ForeignKey(Veterinarian, on_delete=models.CASCADE)
    specialty    = models.ForeignKey(Specialty, on_delete=models.CASCADE)

    class Meta:
        db_table  = 'veterinarian_specialty'
        unique_together = ('veterinarian', 'specialty')


class Tutor(models.Model):
    """
    Dono/responsável pelo animal.
    """
    name    = models.CharField(max_length=200)
    email   = models.EmailField(null=True, blank=True)
    phone   = models.CharField(max_length=20, null=True, blank=True)
    address = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'tutor'

    def __str__(self):
        return self.name


class Animal(models.Model):
    """
    Animal cadastrado na clínica.
    """
    tutor         = models.ForeignKey(Tutor, on_delete=models.CASCADE, related_name='animals')
    name          = models.CharField(max_length=100)
    species       = models.CharField(max_length=50)
    breed         = models.CharField(max_length=100, null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    weight        = models.FloatField(null=True, blank=True)
    active        = models.BooleanField(default=True)

    class Meta:
        db_table = 'animal'

    def __str__(self):
        return f'{self.name} ({self.species}) — {self.tutor.name}'


class Appointment(models.Model):
    """
    Agendamento de consulta/procedimento.
    """
    class AppointmentType(models.TextChoices):
        CONSULTATION = 'consultation', 'Consultation'
        FOLLOW_UP    = 'follow_up',    'Follow-up'
        SURGERY      = 'surgery',      'Surgery'
        VACCINE      = 'vaccine',      'Vaccine'
        EXAM         = 'exam',         'Exam'

    class Status(models.TextChoices):
        SCHEDULED  = 'scheduled',  'Scheduled'
        CONFIRMED  = 'confirmed',  'Confirmed'
        COMPLETED  = 'completed',  'Completed'
        CANCELLED  = 'cancelled',  'Cancelled'
        NO_SHOW    = 'no_show',    'No-show'

    animal           = models.ForeignKey(Animal, on_delete=models.PROTECT, related_name='appointments')
    veterinarian     = models.ForeignKey(Veterinarian, on_delete=models.PROTECT, related_name='appointments')
    receptionist     = models.ForeignKey(Receptionist, null=True, blank=True, on_delete=models.SET_NULL)
    rescheduled_from = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    date             = models.DateField()
    time             = models.TimeField()
    type             = models.CharField(max_length=20, choices=AppointmentType)
    status           = models.CharField(max_length=20, choices=Status, default=Status.SCHEDULED)
    notes            = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'appointment'
        ordering = ['date', 'time']

    def __str__(self):
        return f'{self.animal.name} — {self.date} {self.time} ({self.type})'
