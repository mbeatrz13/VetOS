from rest_framework import viewsets
from .models import Report, Export
from .serializers import ReportSerializer, ExportSerializer


class ReportViewSet(viewsets.ModelViewSet):
    """
    GET    /api/reports/reports/         → lista
    POST   /api/reports/reports/         → gerar relatório
    GET    /api/reports/reports/{id}/    → detalhe com exports
    DELETE /api/reports/reports/{id}/
    """
    queryset         = Report.objects.select_related('generated_by').prefetch_related('exports').all()
    serializer_class = ReportSerializer

    def get_queryset(self):
        qs    = super().get_queryset()
        rtype = self.request.query_params.get('type')
        if rtype:
            qs = qs.filter(type=rtype)
        return qs


class ExportViewSet(viewsets.ModelViewSet):
    """
    GET  /api/reports/exports/
    POST /api/reports/exports/
    GET  /api/reports/exports/{id}/
    """
    queryset         = Export.objects.all().order_by('-generated_at')
    serializer_class = ExportSerializer
