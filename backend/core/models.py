from django.db import models

# Create your models here.

class Customer(models.Model):
    customer_id = models.CharField(max_length=20, primary_key=True)
    username = models.CharField(max_length=50, unique=True)
    auth0_id = models.CharField(max_length=100, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.username} ({self.customer_id})"

class Order(models.Model):
    order_id = models.CharField(max_length=20, primary_key=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.order_id

class Shipment(models.Model):
    shipment_id = models.CharField(max_length=20, primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='shipments')
    tracking_number = models.CharField(max_length=50)
    warehouse_id = models.CharField(max_length=20)
    fulfillment_region = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=10)
    address_id = models.CharField(max_length=20)
    fulfillment_type = models.CharField(max_length=20)
    ship_date = models.DateField()
    estimated_delivery = models.DateField()
    actual_delivery_date = models.DateField(null=True, blank=True)
    current_status = models.CharField(max_length=50)
    last_scan_location = models.CharField(max_length=100)
    scan_timestamp = models.DateTimeField(null=True, blank=True)
    delivery_attempt_status = models.CharField(max_length=50, null=True, blank=True)
    delivery_failure_status = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return self.shipment_id

class ShipmentItem(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='items')
    item_name = models.CharField(max_length=100)
    quantity = models.IntegerField()
    
    def __str__(self):
        return f"{self.item_name} ({self.quantity})"
