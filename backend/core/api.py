from ninja import NinjaAPI, Schema
from typing import List, Optional, Dict
from datetime import date, datetime
from django.shortcuts import get_object_or_404
from django.db.models import Count
from django.http import Http404
import logging
import traceback
from .models import Customer, Order, Shipment, ShipmentItem

# Configure logging
logger = logging.getLogger(__name__)

# Initialize the API with more explicit settings
try:
    api = NinjaAPI(
        title="Amazon Order Tracker API",
        version="1.0.0",
        docs_url="/docs",
        urls_namespace="order_tracker_core_api",
    )
    logger.info("API initialized successfully")
except Exception as e:
    logger.error(f"Error initializing API: {str(e)}\n{traceback.format_exc()}")
    # Still create the API object to avoid import errors
    api = NinjaAPI(title="Amazon Order Tracker API")

# Add a root endpoint
@api.get("/")
def root_endpoint(request):
    return {"message": "Django Ninja API root is working!"}

# Add a simple test endpoint
@api.get("/test")
def test_endpoint(request):
    return {"message": "Django Ninja API is working!"}

# Schema definitions - kept simple to match our CSV data
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
    status: str
    shipments: List[ShipmentSchema]

class OrderListSchema(Schema):
    order_id: str
    order_date: date
    status: str
    items: List[str]
    items_count: int

class DashboardStatsSchema(Schema):
    total_orders: int
    total_shipments: int
    in_transit: int
    delayed: int
    delivered: int
    failed: int
    out_for_delivery: int
    by_region: Dict[str, int]

# Helper function to determine order status based on shipments
def get_order_status(shipments):
    if not shipments:
        return "Processing"
    
    statuses = [s.current_status for s in shipments]
    if "Failed" in statuses:
        return "Failed"
    elif "Delayed" in statuses:
        return "Delayed"
    elif "In Transit" in statuses:
        return "In Transit"
    elif "Out for Delivery" in statuses:
        return "Out for Delivery"
    elif all(s == "Delivered" for s in statuses):
        return "Delivered"
    return "Processing"

# Endpoints
@api.get("/customers/lookup", response=CustomerSchema)
def lookup_customer(request, username: str):
    try:
        customer = get_object_or_404(Customer, username=username)
        return {
            "customer_id": customer.customer_id,
            "username": customer.username,
            "email": customer.email
        }
    except Http404:
        # For demo purposes, create a customer if not found
        customer = Customer.objects.create(
            username=username,
            email=f"{username}@example.com"
        )
        return {
            "customer_id": customer.customer_id,
            "username": customer.username,
            "email": customer.email
        }

@api.get("/customers/{username}/orders", response=List[OrderListSchema])
def list_customer_orders(request, username: str):
    customer = get_object_or_404(Customer, username=username)
    orders = Order.objects.filter(customer=customer)
    
    result = []
    for order in orders:
        # Get the shipments for this order
        shipments = Shipment.objects.filter(order=order)
        status = get_order_status(shipments)
        
        # Get unique items
        items_set = set()
        for shipment in shipments:
            for item in ShipmentItem.objects.filter(shipment=shipment):
                items_set.add(item.item_name)
        
        result.append({
            "order_id": order.order_id,
            "order_date": order.order_date,
            "status": status,
            "items": list(items_set),
            "items_count": len(items_set)
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
    
    status = get_order_status(shipments)
    
    return {
        "order_id": order.order_id,
        "order_date": order.order_date,
        "status": status,
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

@api.get("/customers/{username}/dashboard", response=DashboardStatsSchema)
def get_dashboard_stats(request, username: str):
    customer = get_object_or_404(Customer, username=username)
    
    # Get all orders for the customer
    orders = Order.objects.filter(customer=customer)
    total_orders = orders.count()
    
    # Get all shipments from all customer orders
    shipments = Shipment.objects.filter(order__customer=customer)
    total_shipments = shipments.count()
    
    # Count shipments by status
    in_transit = shipments.filter(current_status="In Transit").count()
    delayed = shipments.filter(current_status="Delayed").count()
    delivered = shipments.filter(current_status="Delivered").count()
    failed = shipments.filter(current_status="Failed").count()
    out_for_delivery = shipments.filter(current_status="Out for Delivery").count()
    
    # Count shipments by region
    regions = shipments.values('fulfillment_region').annotate(count=Count('shipment_id'))
    by_region = {region['fulfillment_region']: region['count'] for region in regions}
    
    return {
        "total_orders": total_orders,
        "total_shipments": total_shipments,
        "in_transit": in_transit,
        "delayed": delayed,
        "delivered": delivered,
        "failed": failed,
        "out_for_delivery": out_for_delivery,
        "by_region": by_region
    } 