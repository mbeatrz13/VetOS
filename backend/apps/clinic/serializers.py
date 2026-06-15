from rest_framework import serializers
from .models import MedicalRecord, Consultation, Exam, Prescription


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Exam
        fields = '__all__'


class PrescriptionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model  = Prescription
        fields = '__all__'


class ConsultationSerializer(serializers.ModelSerializer):
    animal_name  = serializers.CharField(source='medical_record.animal.name', read_only=True)
    vet_name     = serializers.CharField(source='veterinarian.employee.name',  read_only=True)
    exams        = ExamSerializer(many=True, read_only=True)
    prescriptions = PrescriptionSerializer(many=True, read_only=True)

    class Meta:
        model  = Consultation
        fields = '__all__'


class MedicalRecordSerializer(serializers.ModelSerializer):
    animal_name   = serializers.CharField(source='animal.name',        read_only=True)
    tutor_name    = serializers.CharField(source='animal.tutor.name',  read_only=True)
    species       = serializers.CharField(source='animal.species',     read_only=True)

    class Meta:
        model  = MedicalRecord
        fields = '__all__'


class MedicalRecordDetailSerializer(MedicalRecordSerializer):
    """Com histórico completo de consultas."""
    consultations = ConsultationSerializer(many=True, read_only=True)

    class Meta(MedicalRecordSerializer.Meta):
        fields = '__all__'
