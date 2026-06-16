from rest_framework import serializers
from .models import MedicalRecord, Consultation, Exam, Prescription


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Exam
        fields = '__all__'
        read_only_fields = ['request_date']

    def validate(self, data):
        result_date = data.get('result_date')
        status      = data.get('status', getattr(self.instance, 'status', None))

        if result_date and status in ('requested', 'collected', 'processing'):
            raise serializers.ValidationError(
                "Um exame com data de resultado não pode ter status anterior a 'completed'."
            )
        if status == 'completed' and not data.get('results') and not (
            self.instance and self.instance.results
        ):
            raise serializers.ValidationError(
                "Informe o campo 'results' ao concluir um exame."
            )
        return data

class PrescriptionSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model  = Prescription
        fields = '__all__'
        read_only_fields = ['issued_at']

class ConsultationSerializer(serializers.ModelSerializer):
    animal_name   = serializers.CharField(source='medical_record.animal.name', read_only=True)
    vet_name      = serializers.CharField(source='veterinarian.employee.name',  read_only=True)
    exams         = ExamSerializer(many=True, read_only=True)
    prescriptions = PrescriptionSerializer(many=True, read_only=True)

    class Meta:
        model  = Consultation
        fields = '__all__'
        read_only_fields = ['datetime']


class ConsultationWriteSerializer(serializers.ModelSerializer):
    """Usado em create/update — sem nested read-only para evitar conflito."""

    class Meta:
        model  = Consultation
        fields = '__all__'
        read_only_fields = ['datetime']

    def validate(self, data):
        # Appointment pertence ao mesmo animal do MedicalRecord?
        appointment    = data.get('appointment')
        medical_record = data.get('medical_record', getattr(self.instance, 'medical_record', None))

        if appointment and medical_record:
            if appointment.animal_id != medical_record.animal_id:
                raise serializers.ValidationError(
                    "O agendamento não pertence ao animal deste prontuário."
                )
        return data


class MedicalRecordSerializer(serializers.ModelSerializer):
    animal_name = serializers.CharField(source='animal.name',       read_only=True)
    tutor_name  = serializers.CharField(source='animal.tutor.name', read_only=True)
    species     = serializers.CharField(source='animal.species',    read_only=True)

    class Meta:
        model  = MedicalRecord
        fields = '__all__'
        read_only_fields = ['created_at']

    def validate_animal(self, animal):
        qs = MedicalRecord.objects.filter(animal=animal)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "Este animal já possui um prontuário."
            )
        return animal


class MedicalRecordDetailSerializer(MedicalRecordSerializer):
    """Com histórico completo de consultas (incluindo exames e prescrições)."""
    consultations = ConsultationSerializer(many=True, read_only=True)

    class Meta(MedicalRecordSerializer.Meta):
        fields = '__all__'