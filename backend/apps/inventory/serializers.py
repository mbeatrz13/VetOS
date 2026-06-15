from rest_framework import serializers
from .models import Product, StockMovement


class ProductSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model  = Product
        fields = '__all__'


class StockMovementSerializer(serializers.ModelSerializer):
    product_name  = serializers.CharField(source='product.name',   read_only=True)
    employee_name = serializers.CharField(source='employee.name',  read_only=True)

    class Meta:
        model  = StockMovement
        fields = '__all__'
