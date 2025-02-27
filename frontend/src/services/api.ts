import axios, { AxiosError } from 'axios';

// TypeScript interfaces matching backend schemas
export interface Customer {
  customer_id: string;
  username: string;
  email?: string;
}

export interface ShipmentItem {
  item_name: string;
  quantity: number;
}

export interface Shipment {
  shipment_id: string;
  tracking_number: string;
  warehouse_id: string;
  fulfillment_region: string;
  zip_code: string;
  address_id: string;
  fulfillment_type: string;
  ship_date: string;
  estimated_delivery: string;
  actual_delivery_date?: string;
  current_status: string;
  last_scan_location: string;
  scan_timestamp?: string;
  delivery_attempt_status?: string;
  delivery_failure_status?: string;
  items: ShipmentItem[];
}

export interface Order {
  order_id: string;
  order_date: string;
  status: string;
  shipments: Shipment[];
}

export interface OrderListItem {
  order_id: string;
  order_date: string;
  status: string;
  items: string[];
  items_count: number;
}

export interface DashboardStats {
  total_orders: number;
  total_shipments: number;
  in_transit: number;
  delayed: number;
  delivered: number;
  failed: number;
  out_for_delivery: number;
  by_region: Record<string, number>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Base URL from environment or default
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Lookup customer by username
 */
export const lookupCustomer = async (username: string): Promise<ApiResponse<Customer>> => {
  try {
    const response = await api.get(`/customers/lookup?username=${encodeURIComponent(username)}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error looking up customer:', error);
    const axiosError = error as AxiosError;
    return { 
      data: null, 
      error: axiosError.message || 'Failed to lookup customer' 
    };
  }
};

/**
 * Get orders for a customer by username
 */
export const getCustomerOrders = async (username: string): Promise<ApiResponse<OrderListItem[]>> => {
  try {
    const response = await api.get(`/customers/${encodeURIComponent(username)}/orders`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    const axiosError = error as AxiosError;
    return { 
      data: null, 
      error: axiosError.message || 'Failed to fetch orders' 
    };
  }
};

/**
 * Get order details by order ID
 */
export const getOrderDetails = async (orderId: string): Promise<ApiResponse<Order>> => {
  try {
    const response = await api.get(`/orders/${encodeURIComponent(orderId)}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching order details:', error);
    const axiosError = error as AxiosError;
    return { 
      data: null, 
      error: axiosError.message || 'Failed to fetch order details' 
    };
  }
};

/**
 * Get shipment details by shipment ID
 */
export const getShipmentDetails = async (shipmentId: string): Promise<ApiResponse<Shipment>> => {
  try {
    const response = await api.get(`/shipments/${encodeURIComponent(shipmentId)}`);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching shipment details:', error);
    const axiosError = error as AxiosError;
    return { 
      data: null, 
      error: axiosError.message || 'Failed to fetch shipment details' 
    };
  }
};

/**
 * Get dashboard statistics for a customer
 */
export const getDashboardStats = async (username: string): Promise<ApiResponse<DashboardStats>> => {
  try {
    console.log(`Fetching dashboard stats for username: ${username}`);
    const response = await api.get(`/customers/${encodeURIComponent(username)}/dashboard`);
    console.log('Dashboard stats API response:', response);
    return { data: response.data, error: null };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    const axiosError = error as AxiosError;
    let errorMessage = axiosError.message || 'Failed to fetch dashboard statistics';
    
    // More detailed error logging
    if (axiosError.response) {
      console.error('Error response data:', axiosError.response.data);
      console.error('Error response status:', axiosError.response.status);
      console.error('Error response headers:', axiosError.response.headers);
      
      if (axiosError.response.status === 500) {
        errorMessage = 'Server error: The dashboard API is experiencing issues. This might be due to missing data for new users.';
      }
    } else if (axiosError.request) {
      console.error('Error request:', axiosError.request);
    }
    
    return { 
      data: null, 
      error: errorMessage 
    };
  }
};

export default api; 