'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { 
  lookupCustomer, 
  getCustomerOrders, 
  getDashboardStats,
  Customer,
  OrderListItem,
  DashboardStats
} from '@/services';

// Define the context shape
interface OrderContextType {
  customer: Customer | null;
  orders: OrderListItem[];
  dashboardStats: DashboardStats | null;
  isLoadingCustomer: boolean;
  isLoadingOrders: boolean;
  isLoadingDashboard: boolean;
  customerError: string | null;
  ordersError: string | null;
  dashboardError: string | null;
  refreshOrders: () => void;
  refreshDashboard: () => void;
}

// Create the context with default values
const OrderContext = createContext<OrderContextType>({
  customer: null,
  orders: [],
  dashboardStats: null,
  isLoadingCustomer: false,
  isLoadingOrders: false,
  isLoadingDashboard: false,
  customerError: null,
  ordersError: null,
  dashboardError: null,
  refreshOrders: () => {},
  refreshDashboard: () => {},
});

// Define provider props
interface OrderProviderProps {
  children: React.ReactNode;
}

// Create the provider component
export const OrderProvider = ({ children }: OrderProviderProps) => {
  const { user, isLoading: isUserLoading } = useUser();
  
  // State for customer data
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [customerError, setCustomerError] = useState<string | null>(null);
  
  // State for orders
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  
  // State for dashboard stats
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  
  // Function to extract username from user email
  const getUsernameFromUser = (): string | null => {
    if (!user || !user.email) return null;
    const username = user.email.split('@')[0]; // Simple way to create username from email
    console.log('Generated username from email:', username);
    return username;
  };
  
  // Load customer data when user logs in
  const loadCustomer = async () => {
    const username = getUsernameFromUser();
    if (!username) return;
    
    console.log('Loading customer data for username:', username);
    setIsLoadingCustomer(true);
    setCustomerError(null);
    
    try {
      const response = await lookupCustomer(username);
      console.log('Customer lookup response:', response);
      
      if (response.error) {
        console.error('Customer lookup error:', response.error);
        setCustomerError(response.error);
        return;
      }
      
      if (response.data) {
        console.log('Customer data loaded:', response.data);
        setCustomer(response.data);
      }
    } catch (error) {
      console.error('Error in loadCustomer:', error);
      setCustomerError('Failed to load customer data');
    } finally {
      setIsLoadingCustomer(false);
    }
  };
  
  // Load orders for the customer
  const loadOrders = async () => {
    const username = getUsernameFromUser();
    if (!username) return;
    
    console.log('Loading orders for username:', username);
    setIsLoadingOrders(true);
    setOrdersError(null);
    
    try {
      const response = await getCustomerOrders(username);
      console.log('Orders response:', response);
      
      if (response.error) {
        console.error('Orders error:', response.error);
        setOrdersError(response.error);
        return;
      }
      
      if (response.data) {
        console.log('Orders loaded:', response.data);
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error in loadOrders:', error);
      setOrdersError('Failed to load orders');
    } finally {
      setIsLoadingOrders(false);
    }
  };
  
  // Load dashboard statistics
  const loadDashboardStats = async () => {
    const username = getUsernameFromUser();
    if (!username) return;
    
    console.log('Loading dashboard stats for username:', username);
    setIsLoadingDashboard(true);
    setDashboardError(null);
    
    try {
      const response = await getDashboardStats(username);
      console.log('Dashboard stats response:', response);
      
      if (response.error) {
        console.error('Dashboard stats error:', response.error);
        setDashboardError(response.error);
        return;
      }
      
      if (response.data) {
        console.log('Dashboard stats loaded:', response.data);
        setDashboardStats(response.data);
      }
    } catch (error) {
      console.error('Error in loadDashboardStats:', error);
      setDashboardError('Failed to load dashboard statistics');
    } finally {
      setIsLoadingDashboard(false);
    }
  };
  
  // Function to refresh orders
  const refreshOrders = () => {
    console.log('Refreshing orders...');
    loadOrders();
  };
  
  // Function to refresh dashboard
  const refreshDashboard = () => {
    console.log('Refreshing dashboard...');
    loadDashboardStats();
  };
  
  // Load data when user is available
  useEffect(() => {
    console.log('User state changed:', { user: user?.email, isLoading: isUserLoading });
    
    if (isUserLoading || !user) return;
    
    loadCustomer();
    loadOrders();
    loadDashboardStats();
  }, [user, isUserLoading]);
  
  // Context value
  const value: OrderContextType = {
    customer,
    orders,
    dashboardStats,
    isLoadingCustomer,
    isLoadingOrders,
    isLoadingDashboard,
    customerError,
    ordersError,
    dashboardError,
    refreshOrders,
    refreshDashboard,
  };
  
  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};

// Create a hook to use the context
export const useOrder = () => useContext(OrderContext);

export default OrderProvider; 