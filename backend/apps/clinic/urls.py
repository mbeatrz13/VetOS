from rest_framework.routers import DefaultRouter
from .views import MedicalRecordViewSet, ConsultationViewSet, ExamViewSet, PrescriptionViewSet

router = DefaultRouter()
router.register(r'medical-records', MedicalRecordViewSet)
router.register(r'consultations',   ConsultationViewSet)
router.register(r'exams',           ExamViewSet)
router.register(r'prescriptions',   PrescriptionViewSet)

urlpatterns = router.urls
