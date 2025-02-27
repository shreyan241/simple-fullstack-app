from ninja import NinjaAPI, Schema
from typing import List, Optional
from datetime import date, datetime
from django.shortcuts import get_object_or_404
from .models import Customer, Order, Shipment, ShipmentItem

# Initialize the API
api = NinjaAPI(title="Amazon Order Tracker API")

# Schema definitions
class CustomerSchema(Schema):
    customer_id: str
    username: str
    email: Optional[str] = None

class ShipmentItemSchema(Schema):
    item_name: str
    quantity: int

class ShipmentSchema(Schema):
    shipment_id: str
    tracking_number: str
    warehouse_id: str
    fulfillment_region: str
    zip_code: str
    address_id: str
    fulfillment_type: str
    ship_date: date
    estimated_delivery: date
    actual_delivery_date: Optional[date] = None
    current_status: str
    last_scan_location: str
    scan_timestamp: Optional[datetime] = None
    delivery_attempt_status: Optional[str] = None
    delivery_failure_status: Optional[str] = None
    items: List[ShipmentItemSchema]

class OrderSchema(Schema):
    order_id: str
    order_date: date
    customer_id: str
    shipments: List[ShipmentSchema]

class OrderListSchema(Schema):
    order_id: str
    order_date: date
    status: str  # Derived from shipment statuses

# Endpoints
@api.get("/customers/{customer_id}", response=CustomerSchema)
def get_customer(request, customer_id: str):
    return get_object_or_404(Customer, customer_id=customer_id)

@api.get("/customers/{customer_id}/orders", response=List[OrderListSchema])
def list_customer_orders(request, customer_id: str):
    customer = get_object_or_404(Customer, customer_id=customer_id)
    orders = Order.objects.filter(customer=customer)
    
    result = []
    for order in orders:
        # Get the latest shipment status for the order
        shipments = Shipment.objects.filter(order=order)
        status = "Unknown"
        if shipments.exists():
            # Use the "worst" status as the order status
            statuses = [s.current_status for s in shipments]
            if "Failed" in statuses:
                status = "Failed"
            elif "Delayed" in statuses:
                status = "Delayed"
            elif "In Transit" in statuses:
                status = "In Transit"
            elif "Out for Delivery" in statuses:
                status = "Out for Delivery"
            elif all(s == "Delivered" for s in statuses):
                status = "Delivered"
        
        result.append({
            "order_id": order.order_id,
            "order_date": order.order_date,
            "status": status
        })
    
    return result

@api.get("/orders/{order_id}", response=OrderSchema)
def get_order(request, order_id: str):
    order = get_object_or_404(Order, order_id=order_id)
    
    # Get all shipments for this order
    shipments = Shipment.objects.filter(order=order)
    shipment_data = []
    
    for shipment in shipments:
        # Get items for this shipment
        items = ShipmentItem.objects.filter(shipment=shipment)
        item_data = [{"item_name": item.item_name, "quantity": item.quantity} for item in items]
        
        shipment_data.append({
            "shipment_id": shipment.shipment_id,
            "tracking_number": shipment.tracking_number,
            "warehouse_id": shipment.warehouse_id,
            "fulfillment_region": shipment.fulfillment_region,
            "zip_code": shipment.zip_code,
            "address_id": shipment.address_id,
            "fulfillment_type": shipment.fulfillment_type,
            "ship_date": shipment.ship_date,
            "estimated_delivery": shipment.estimated_delivery,
            "actual_delivery_date": shipment.actual_delivery_date,
            "current_status": shipment.current_status,
            "last_scan_location": shipment.last_scan_location,
            "scan_timestamp": shipment.scan_timestamp,
            "delivery_attempt_status": shipment.delivery_attempt_status,
            "delivery_failure_status": shipment.delivery_failure_status,
            "items": item_data
        })
    
    return {
        "order_id": order.order_id,
        "order_date": order.order_date,
        "customer_id": order.customer.customer_id,
        "shipments": shipment_data
    }

@api.get("/shipments/{shipment_id}", response=ShipmentSchema)
def get_shipment(request, shipment_id: str):
    shipment = get_object_or_404(Shipment, shipment_id=shipment_id)
    
    # Get items for this shipment
    items = ShipmentItem.objects.filter(shipment=shipment)
    item_data = [{"item_name": item.item_name, "quantity": item.quantity} for item in items]
    
    return {
        "shipment_id": shipment.shipment_id,
        "tracking_number": shipment.tracking_number,
        "warehouse_id": shipment.warehouse_id,
        "fulfillment_region": shipment.fulfillment_region,
        "zip_code": shipment.zip_code,
        "address_id": shipment.address_id,
        "fulfillment_type": shipment.fulfillment_type,
        "ship_date": shipment.ship_date,
        "estimated_delivery": shipment.estimated_delivery,
        "actual_delivery_date": shipment.actual_delivery_date,
        "current_status": shipment.current_status,
        "last_scan_location": shipment.last_scan_location,
        "scan_timestamp": shipment.scan_timestamp,
        "delivery_attempt_status": shipment.delivery_attempt_status,
        "delivery_failure_status": shipment.delivery_failure_status,
        "items": item_data
    } 