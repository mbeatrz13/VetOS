from django.db import models
from apps.reception.models import Employee


class Product(models.Model):
    """
    Produto/medicamento no estoque.
    """
    name           = models.CharField(max_length=200)
    category       = models.CharField(max_length=100)
    quantity       = models.IntegerField(default=0)
    minimum_stock  = models.IntegerField(default=0)
    unit           = models.CharField(max_length=50)
    expiry_date    = models.DateField(null=True, blank=True)
    unit_price     = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        db_table = 'product'

    def __str__(self):
        return self.name

    @property
    def is_low_stock(self):
        return self.quantity <= self.minimum_stock


class StockMovement(models.Model):
    """
    Cada entrada/saída atualiza o campo quantity do produto via signal.
    """
    class MovementType(models.TextChoices):
        IN       = 'in',       'Entry'
        OUT      = 'out',      'Exit'
        ADJUST   = 'adjust',   'Adjustment'
        DISCARD  = 'discard',  'Discard'

    product    = models.ForeignKey(Product, on_delete=models.PROTECT, related_name='movements')
    employee   = models.ForeignKey(Employee, on_delete=models.PROTECT)
    type       = models.CharField(max_length=20, choices=MovementType)
    quantity   = models.IntegerField()
    reason     = models.CharField(max_length=300, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stock_movement'
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        p = self.product
        if self.type == self.MovementType.IN:
            p.quantity += self.quantity
        elif self.type in (self.MovementType.OUT, self.MovementType.DISCARD):
            p.quantity -= self.quantity
        else:
            p.quantity += self.quantity   # adjust pode ser negativo
        p.save(update_fields=['quantity'])
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.type} {self.quantity}x {self.product.name}'
