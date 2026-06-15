from rest_framework.routers import DefaultRouter
from .views import ReportViewSet, ExportViewSet

router = DefaultRouter()
router.register(r'reports', ReportViewSet)
router.register(r'exports', ExportViewSet)

urlpatterns = router.urls
