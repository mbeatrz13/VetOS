from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, StockMovementViewSet

router = DefaultRouter()
router.register(r'products',  ProductViewSet)
router.register(r'movements', StockMovementViewSet)

urlpatterns = router.urls
