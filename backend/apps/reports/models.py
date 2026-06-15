from django.db import models
from apps.reception.models import Employee


class Report(models.Model):
    class ReportType(models.TextChoices):
        CONSULTATIONS = 'consultations', 'Consultations'
        FINANCIAL     = 'financial',     'Financial'
        INVENTORY     = 'inventory',     'Inventory'
        APPOINTMENTS  = 'appointments',  'Appointments'
        ANIMALS       = 'animals',       'Animals'

    generated_by   = models.ForeignKey(Employee, on_delete=models.PROTECT)
    type           = models.CharField(max_length=20, choices=ReportType)
    period_start   = models.DateField()
    period_end     = models.DateField()
    generated_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'report'
        ordering = ['-generated_at']

    def __str__(self):
        return f'{self.type} ({self.period_start} → {self.period_end})'


class Export(models.Model):
    class Format(models.TextChoices):
        PDF  = 'pdf',  'PDF'
        CSV  = 'csv',  'CSV'
        XLSX = 'xlsx', 'XLSX'

    report       = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='exports')
    format       = models.CharField(max_length=10, choices=Format)
    generated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'export'

    def __str__(self):
        return f'{self.report} → {self.format}'
