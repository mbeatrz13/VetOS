from rest_framework import serializers
from .models import (
    Employee, Veterinarian, Receptionist, Specialty,
    VeterinarianSpecialty, Tutor, Animal, Appointment,
)


class SpecialtySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Specialty
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model  = Employee
        fields = '__all__'


class VeterinarianSerializer(serializers.ModelSerializer):
    name        = serializers.CharField(source='employee.name', read_only=True)
    specialties = SpecialtySerializer(many=True, read_only=True)
    specialty_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Specialty.objects.all(),
        source='specialties', write_only=True, required=False,
    )

    class Meta:
        model  = Veterinarian
        fields = ['employee_id', 'employee', 'name', 'crmv', 'specialties', 'specialty_ids']


class ReceptionistSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='employee.name', read_only=True)

    class Meta:
        model  = Receptionist
        fields = ['employee_id', 'employee', 'name']


class TutorSerializer(serializers.ModelSerializer):
    animal_count = serializers.IntegerField(source='animals.count', read_only=True)

    class Meta:
        model  = Tutor
        fields = '__all__'


class AnimalSerializer(serializers.ModelSerializer):
    tutor_name = serializers.CharField(source='tutor.name', read_only=True)

    class Meta:
        model  = Animal
        fields = '__all__'


class AppointmentSerializer(serializers.ModelSerializer):
    animal_name      = serializers.CharField(source='animal.name',              read_only=True)
    tutor_name       = serializers.CharField(source='animal.tutor.name',        read_only=True)
    vet_name         = serializers.CharField(source='veterinarian.employee.name', read_only=True)

    class Meta:
        model  = Appointment
        fields = '__all__'
