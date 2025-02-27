'use client';

import React from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useOrder } from '@/contexts/OrderProvider';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Alert,
  Stack,
  Card,
  CardContent,
} from '@mui/material';

export default function TestPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const {
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
  } = useOrder();

  // Handle login/logout
  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  // Handle refresh buttons
  const handleRefreshOrders = () => {
    refreshOrders();
  };

  const handleRefreshDashboard = () => {
    refreshDashboard();
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        API Test Page
      </Typography>

      <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h6" gutterBottom>
          User Status
        </Typography>
        
        {isUserLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CircularProgress size={20} sx={{ mr: 2 }} />
            <Typography>Loading user...</Typography>
          </Box>
        ) : user ? (
          <Box>
            <Typography>
              Logged in as: <strong>{user.email}</strong>
            </Typography>
            <Button 
              variant="outlined" 
              onClick={handleLogout} 
              sx={{ mt: 2 }}
            >
              Log Out
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography>
              Not logged in
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleLogin} 
              sx={{ mt: 2 }}
            >
              Log In
            </Button>
          </Box>
        )}
      </Paper>

      {user && (
        <>
          {/* Customer Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>
              Customer Data
            </Typography>
            
            {isLoadingCustomer ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                <Typography>Loading customer data...</Typography>
              </Box>
            ) : customerError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {customerError}
              </Alert>
            ) : customer ? (
              <Stack spacing={1}>
                <Typography>
                  Customer ID: <strong>{customer.customer_id}</strong>
                </Typography>
                <Typography>
                  Username: <strong>{customer.username}</strong>
                </Typography>
                <Typography>
                  Email: <strong>{customer.email || 'N/A'}</strong>
                </Typography>
              </Stack>
            ) : (
              <Typography color="text.secondary">
                No customer data available
              </Typography>
            )}
          </Paper>

          {/* Orders Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Orders
              </Typography>
              <Button variant="outlined" onClick={handleRefreshOrders} disabled={isLoadingOrders}>
                Refresh
              </Button>
            </Box>
            
            {isLoadingOrders ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                <Typography>Loading orders...</Typography>
              </Box>
            ) : ordersError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {ordersError}
              </Alert>
            ) : orders.length > 0 ? (
              <Stack spacing={2}>
                {orders.map((order) => (
                  <Card key={order.order_id} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        Order ID: {order.order_id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Date: {new Date(order.order_date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Status: {order.status}
                      </Typography>
                      <Typography variant="body2">
                        Items: {order.items_count}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                No orders available
              </Typography>
            )}
          </Paper>

          {/* Dashboard Stats Section */}
          <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Dashboard Stats
              </Typography>
              <Button variant="outlined" onClick={handleRefreshDashboard} disabled={isLoadingDashboard}>
                Refresh
              </Button>
            </Box>
            
            {isLoadingDashboard ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 2 }} />
                <Typography>Loading dashboard stats...</Typography>
              </Box>
            ) : dashboardError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {dashboardError}
              </Alert>
            ) : dashboardStats ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Order Statistics:
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Card sx={{ width: '25%' }} variant="outlined">
                    <CardContent>
                      <Typography variant="h5">{dashboardStats.total_orders}</Typography>
                      <Typography variant="body2">Total Orders</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ width: '25%' }} variant="outlined">
                    <CardContent>
                      <Typography variant="h5">{dashboardStats.total_shipments}</Typography>
                      <Typography variant="body2">Total Shipments</Typography>
                    </CardContent>
                  </Card>
                </Stack>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Shipment Status:
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap' }}>
                  <Card sx={{ width: '22%', mb: 1 }} variant="outlined">
                    <CardContent>
                      <Typography variant="h5">{dashboardStats.in_transit}</Typography>
                      <Typography variant="body2">In Transit</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ width: '22%', mb: 1 }} variant="outlined">
                    <CardContent>
                      <Typography variant="h5">{dashboardStats.delayed}</Typography>
                      <Typography variant="body2">Delayed</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ width: '22%', mb: 1 }} variant="outlined">
                    <CardContent>
                      <Typography variant="h5">{dashboardStats.delivered}</Typography>
                      <Typography variant="body2">Delivered</Typography>
                    </CardContent>
                  </Card>
                  <Card sx={{ width: '22%', mb: 1 }} variant="outlined">
                    <CardContent>
                      <Typography variant="h5">{dashboardStats.out_for_delivery}</Typography>
                      <Typography variant="body2">Out for Delivery</Typography>
                    </CardContent>
                  </Card>
                </Stack>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  Regional Distribution:
                </Typography>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <pre>{JSON.stringify(dashboardStats.by_region, null, 2)}</pre>
                </Box>
              </Box>
            ) : (
              <Typography color="text.secondary">
                No dashboard statistics available
              </Typography>
            )}
          </Paper>

          {/* Debug Section */}
          <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom>
              Raw Debug Data
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Check console for more detailed logs
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" gutterBottom>
              Customer:
            </Typography>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2, overflow: 'auto' }}>
              <pre>{JSON.stringify(customer, null, 2)}</pre>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Orders:
            </Typography>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2, overflow: 'auto' }}>
              <pre>{JSON.stringify(orders, null, 2)}</pre>
            </Box>
            
            <Typography variant="subtitle2" gutterBottom>
              Dashboard Stats:
            </Typography>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'auto' }}>
              <pre>{JSON.stringify(dashboardStats, null, 2)}</pre>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
} 