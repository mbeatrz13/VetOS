from rest_framework import serializers
from .models import Report, Export


class ExportSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Export
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.CharField(source='generated_by.name', read_only=True)
    exports           = ExportSerializer(many=True, read_only=True)

    class Meta:
        model  = Report
        fields = '__all__'
