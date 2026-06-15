from rest_framework.routers import DefaultRouter
from .views import (
    SpecialtyViewSet, EmployeeViewSet, VeterinarianViewSet,
    ReceptionistViewSet, TutorViewSet, AnimalViewSet, AppointmentViewSet,
)

router = DefaultRouter()
router.register(r'specialties',    SpecialtyViewSet)
router.register(r'employees',      EmployeeViewSet)
router.register(r'veterinarians',  VeterinarianViewSet)
router.register(r'receptionists',  ReceptionistViewSet)
router.register(r'tutors',         TutorViewSet)
router.register(r'animals',        AnimalViewSet)
router.register(r'appointments',   AppointmentViewSet)

urlpatterns = router.urls
