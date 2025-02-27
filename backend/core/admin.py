from django.contrib import admin
from .models import Customer, Order, Shipment, ShipmentItem

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('customer_id', 'username', 'auth0_id')
    search_fields = ('customer_id', 'username')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer', 'order_date')
    list_filter = ('order_date',)
    search_fields = ('order_id', 'customer__username')

class ShipmentItemInline(admin.TabularInline):
    model = ShipmentItem
    extra = 0

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('shipment_id', 'order', 'current_status', 'ship_date', 'estimated_delivery')
    list_filter = ('current_status', 'fulfillment_type', 'fulfillment_region')
    search_fields = ('shipment_id', 'tracking_number', 'order__order_id')
    inlines = [ShipmentItemInline]

@admin.register(ShipmentItem)
class ShipmentItemAdmin(admin.ModelAdmin):
    list_display = ('shipment', 'item_name', 'quantity')
    search_fields = ('item_name', 'shipment__shipment_id')
