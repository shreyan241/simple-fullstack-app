import csv
import os
from datetime import datetime
from django.core.management.base import BaseCommand
from django.db import transaction
from core.models import Customer, Order, Shipment, ShipmentItem

class Command(BaseCommand):
    help = 'Import data from CSV files'

    def add_arguments(self, parser):
        parser.add_argument('--customers', type=str, help='Path to customer_logins.csv')
        parser.add_argument('--orders', type=str, help='Path to amazon_business_tracking_data.csv')

    def handle(self, *args, **options):
        customers_file = options.get('customers')
        orders_file = options.get('orders')
        
        if not customers_file or not os.path.exists(customers_file):
            self.stdout.write(self.style.ERROR(f'Customers file not found: {customers_file}'))
            return
        
        if not orders_file or not os.path.exists(orders_file):
            self.stdout.write(self.style.ERROR(f'Orders file not found: {orders_file}'))
            return
        
        self.import_customers(customers_file)
        self.import_orders(orders_file)
        
        self.stdout.write(self.style.SUCCESS('Data import completed successfully'))
    
    @transaction.atomic
    def import_customers(self, file_path):
        self.stdout.write('Importing customers...')
        count = 0
        
        with open(file_path, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                Customer.objects.create(
                    customer_id=row['Customer ID'],
                    username=row['Username'],
                    # We'll link Auth0 IDs later
                )
                count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Imported {count} customers'))
    
    @transaction.atomic
    def import_orders(self, file_path):
        self.stdout.write('Importing orders, shipments, and items...')
        orders_count = 0
        shipments_count = 0
        items_count = 0
        
        with open(file_path, 'r') as f:
            reader = csv.DictReader(f)
            
            # Track processed orders and shipments to avoid duplicates
            processed_orders = set()
            processed_shipments = set()
            
            for row in reader:
                customer_id = row['Customer ID']
                order_id = row['Order ID']
                shipment_id = row['Shipment ID']
                
                # Create or get order if not already processed
                if order_id not in processed_orders:
                    order, created = Order.objects.get_or_create(
                        order_id=order_id,
                        defaults={
                            'customer_id': customer_id,
                            'order_date': datetime.strptime(row['Order Date'], '%Y-%m-%d').date()
                        }
                    )
                    if created:
                        orders_count += 1
                    processed_orders.add(order_id)
                
                # Create shipment if not already processed
                if shipment_id not in processed_shipments:
                    # Parse dates, handling empty values
                    ship_date = datetime.strptime(row['Ship Date'], '%Y-%m-%d').date() if row['Ship Date'] else None
                    estimated_delivery = datetime.strptime(row['Estimated Delivery'], '%Y-%m-%d').date() if row['Estimated Delivery'] else None
                    actual_delivery_date = datetime.strptime(row['Actual Delivery Date'], '%Y-%m-%d').date() if row['Actual Delivery Date'] else None
                    scan_timestamp = datetime.strptime(row['Scan Timestamp'], '%Y-%m-%d %H:%M:%S') if row['Scan Timestamp'] else None
                    
                    shipment = Shipment.objects.create(
                        shipment_id=shipment_id,
                        order_id=order_id,
                        tracking_number=row['Tracking Number'],
                        warehouse_id=row['Warehouse ID'],
                        fulfillment_region=row['Fulfillment Region'],
                        zip_code=row['Zip Code'],
                        address_id=row['Address ID'],
                        fulfillment_type=row['Fulfillment Type'],
                        ship_date=ship_date,
                        estimated_delivery=estimated_delivery,
                        actual_delivery_date=actual_delivery_date,
                        current_status=row['Current Status'],
                        last_scan_location=row['Last Scan Location'],
                        scan_timestamp=scan_timestamp,
                        delivery_attempt_status=row['Delivery Attempt Status'] or None,
                        delivery_failure_status=row['Delivery Failure Status'] or None
                    )
                    shipments_count += 1
                    processed_shipments.add(shipment_id)
                    
                    # Create shipment item
                    ShipmentItem.objects.create(
                        shipment=shipment,
                        item_name=row['Package Items'],
                        quantity=int(row['Quantity'])
                    )
                    items_count += 1
        
        self.stdout.write(self.style.SUCCESS(f'Imported {orders_count} orders, {shipments_count} shipments, and {items_count} items')) 