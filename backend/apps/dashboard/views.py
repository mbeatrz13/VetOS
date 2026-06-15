from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.reception.models import Animal, Appointment
from apps.clinic.models import Consultation, Exam
from apps.inventory.models import Product


@api_view(['GET'])
def dashboard_summary(request):
    """
    GET /api/dashboard/summary/

    Retorna os dados consolidados exibidos no Dashboard do frontend:
    - consultas hoje
    - total de animais ativos
    - atendimentos no mês
    - produtos em estoque crítico
    - alertas
    - atividades recentes
    """
    today     = timezone.now().date()
    month_start = today.replace(day=1)

    appointments_today    = Appointment.objects.filter(date=today).count()
    animals_total         = Animal.objects.filter(active=True).count()
    consultations_month   = Consultation.objects.filter(datetime__date__gte=month_start).count()
    low_stock_count       = Product.objects.filter(quantity__lte=models_quantity('minimum_stock')).count()

    # Alertas dinâmicos
    alerts = []
    low_stock_products = Product.objects.filter(
        quantity__lte=models_quantity('minimum_stock')
    ).count()
    if low_stock_products:
        alerts.append({
            'type':    'warning',
            'message': f'{low_stock_products} produto(s) com estoque baixo',
            'module':  'inventory',
        })

    pending_exams = Exam.objects.filter(status='requested').count()
    if pending_exams:
        alerts.append({
            'type':    'warning',
            'message': f'{pending_exams} exame(s) aguardando resultado',
            'module':  'clinic',
        })

    todays_appointments = Appointment.objects.filter(date=today).count()
    if todays_appointments:
        alerts.append({
            'type':    'info',
            'message': f'{todays_appointments} consulta(s) agendada(s) para hoje',
            'module':  'reception',
        })

    # Atividades recentes (últimas 5 consultas)
    recent = Consultation.objects.select_related(
        'medical_record__animal__tutor', 'veterinarian__employee'
    ).order_by('-datetime')[:5]

    recent_activity = [
        {
            'animal':      c.medical_record.animal.name,
            'tutor':       c.medical_record.animal.tutor.name,
            'vet':         c.veterinarian.employee.name,
            'type':        c.type,
            'status':      c.status,
            'datetime':    c.datetime,
        }
        for c in recent
    ]

    return Response({
        'stats': {
            'appointments_today':  appointments_today,
            'animals_total':       animals_total,
            'consultations_month': consultations_month,
            'low_stock_count':     low_stock_count,
        },
        'alerts':          alerts,
        'recent_activity': recent_activity,
    })


def models_quantity(field):
    """Helper para filtro quantity <= minimum_stock sem F() import."""
    from django.db.models import F
    return F(field)
