from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, StockMovement
from .serializers import ProductSerializer, StockMovementSerializer


class ProductViewSet(viewsets.ModelViewSet):
    """
    GET    /api/inventory/products/                → lista (search: name, category)
    POST   /api/inventory/products/
    GET    /api/inventory/products/{id}/
    PUT    /api/inventory/products/{id}/
    DELETE /api/inventory/products/{id}/
    GET    /api/inventory/products/low-stock/      → produtos abaixo do mínimo
    """
    queryset         = Product.objects.all().order_by('name')
    serializer_class = ProductSerializer
    filter_backends  = [filters.SearchFilter]
    search_fields    = ['name', 'category']

    def get_queryset(self):
        qs       = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            qs = qs.filter(category__iexact=category)
        return qs

    @action(detail=False, methods=['get'], url_path='low-stock')
    def low_stock(self, request):
        """Retorna produtos com quantity <= minimum_stock."""
        qs = self.get_queryset().filter(quantity__lte=models_F('minimum_stock'))
        return Response(self.get_serializer(qs, many=True).data)


class StockMovementViewSet(viewsets.ModelViewSet):
    """
    GET    /api/inventory/movements/               → lista (filtros: product, type)
    POST   /api/inventory/movements/               → registra movimento (atualiza estoque)
    GET    /api/inventory/movements/{id}/
    """
    queryset         = StockMovement.objects.select_related('product', 'employee').all()
    serializer_class = StockMovementSerializer

    def get_queryset(self):
        qs      = super().get_queryset()
        product = self.request.query_params.get('product')
        mtype   = self.request.query_params.get('type')
        if product:
            qs = qs.filter(product_id=product)
        if mtype:
            qs = qs.filter(type=mtype)
        return qs
