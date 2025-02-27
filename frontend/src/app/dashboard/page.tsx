'use client';

import React, { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/navigation';
import { useOrder } from '@/contexts/OrderProvider';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  IconButton,
  useTheme,
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  Navigation as NavigationIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  AccessTime as PendingIcon,
  ArrowForward as ArrowForwardIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  let color: 'success' | 'warning' | 'error' | 'default' | 'info' | 'primary' | 'secondary' = 'default';
  let icon = null;

  switch (status) {
    case 'Delivered':
      color = 'success';
      icon = <DeliveredIcon fontSize="small" />;
      break;
    case 'In Transit':
      color = 'info';
      icon = <ShippingIcon fontSize="small" />;
      break;
    case 'Delayed':
      color = 'warning';
      icon = <WarningIcon fontSize="small" />;
      break;
    case 'Failed':
      color = 'error';
      icon = <WarningIcon fontSize="small" />;
      break;
    case 'Out for Delivery':
      color = 'primary';
      icon = <NavigationIcon fontSize="small" />;
      break;
    case 'Processing':
      color = 'secondary';
      icon = <PendingIcon fontSize="small" />;
      break;
    default:
      color = 'default';
      icon = <InventoryIcon fontSize="small" />;
  }

  return (
    <Chip 
      icon={icon} 
      label={status} 
      color={color} 
      size="small" 
      variant="outlined"
      sx={{ fontWeight: 'medium' }}
    />
  );
};

// Main Dashboard Component
export default function Dashboard() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const theme = useTheme();
  
  const {
    customer,
    orders,
    dashboardStats,
    isLoadingOrders,
    isLoadingDashboard,
    ordersError,
    dashboardError,
    refreshOrders,
    refreshDashboard,
  } = useOrder();

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [isUserLoading, user, router]);

  // Get recent orders (up to 5)
  const recentOrders = orders.slice(0, 5);

  // Handle refresh
  const handleRefresh = () => {
    refreshOrders();
    refreshDashboard();
  };

  // If user is not logged in or still loading, show loading
  if (isUserLoading || !user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with refresh button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Order Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<RefreshIcon />} 
            variant="outlined" 
            onClick={handleRefresh}
            disabled={isLoadingOrders || isLoadingDashboard}
          >
            Refresh Data
          </Button>
          <Button 
            startIcon={<LogoutIcon />}
            variant="outlined" 
            color="error"
            href="/api/auth/logout"
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Loading indicators */}
      {(isLoadingDashboard || isLoadingOrders) && (
        <LinearProgress sx={{ mb: 3 }} />
      )}

      {/* Error alerts */}
      {dashboardError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Dashboard Error: {dashboardError}
        </Alert>
      )}
      
      {ordersError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Orders Error: {ordersError}
        </Alert>
      )}

      {/* Customer info card */}
      {customer && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 4, 
            border: '1px solid', 
            borderColor: 'divider',
            borderRadius: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.light}22, ${theme.palette.primary.main}11)`
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Box 
                sx={{ 
                  width: 60, 
                  height: 60, 
                  bgcolor: theme.palette.primary.main, 
                  color: 'white', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                }}
              >
                {customer.username.substring(0, 2).toUpperCase()}
              </Box>
            </Grid>
            <Grid item xs>
              <Typography variant="h6">{customer.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                Customer ID: {customer.customer_id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {customer.email}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Order stats */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Total Orders
              </Typography>
              <Typography variant="h3" component="div">
                {dashboardStats?.total_orders || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {dashboardStats?.total_shipments || 0} total shipments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* In Transit */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: `${theme.palette.info.main}11`
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ShippingIcon color="info" sx={{ mr: 1 }} />
                <Typography color="text.secondary">
                  In Transit
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                {dashboardStats?.in_transit || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {dashboardStats?.out_for_delivery || 0} out for delivery
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Issues */}
        <Grid item xs={12} sm={6} md={4}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              bgcolor: (dashboardStats?.delayed || 0) + (dashboardStats?.failed || 0) > 0 
                ? `${theme.palette.warning.main}11` 
                : 'transparent'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WarningIcon color="warning" sx={{ mr: 1 }} />
                <Typography color="text.secondary">
                  Issues
                </Typography>
              </Box>
              <Typography variant="h3" component="div">
                {(dashboardStats?.delayed || 0) + (dashboardStats?.failed || 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {dashboardStats?.delayed || 0} delayed, {dashboardStats?.failed || 0} failed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Breakdown */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 4, 
          display: 'flex', 
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Typography variant="h6" gutterBottom>
          Shipment Status Breakdown
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ textAlign: 'center', p: 1.5 }}>
              <ShippingIcon color="info" sx={{ fontSize: 30 }} />
              <Typography variant="h5">{dashboardStats?.in_transit || 0}</Typography>
              <Typography variant="body2" color="text.secondary">In Transit</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ textAlign: 'center', p: 1.5 }}>
              <NavigationIcon color="primary" sx={{ fontSize: 30 }} />
              <Typography variant="h5">{dashboardStats?.out_for_delivery || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Out for Delivery</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ textAlign: 'center', p: 1.5 }}>
              <DeliveredIcon color="success" sx={{ fontSize: 30 }} />
              <Typography variant="h5">{dashboardStats?.delivered || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Delivered</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ textAlign: 'center', p: 1.5 }}>
              <WarningIcon color="warning" sx={{ fontSize: 30 }} />
              <Typography variant="h5">{dashboardStats?.delayed || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Delayed</Typography>
            </Card>
          </Grid>
          
          <Grid item xs={6} sm={4} md={2}>
            <Card variant="outlined" sx={{ textAlign: 'center', p: 1.5 }}>
              <WarningIcon color="error" sx={{ fontSize: 30 }} />
              <Typography variant="h5">{dashboardStats?.failed || 0}</Typography>
              <Typography variant="body2" color="text.secondary">Failed</Typography>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Regional Distribution */}
      {dashboardStats?.by_region && Object.keys(dashboardStats.by_region).length > 0 && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 4, 
            display: 'flex', 
            flexDirection: 'column',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom>
            Regional Distribution
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {Object.entries(dashboardStats.by_region).map(([region, count]) => (
              <Grid item xs={6} sm={4} md={3} key={region}>
                <Card variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {region}
                  </Typography>
                  <Typography variant="h5">
                    {count}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}

      {/* Recent Orders */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2,
          display: 'flex', 
          flexDirection: 'column',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" component="h2">
            Recent Orders
          </Typography>
        </Box>
        
        <Box sx={{ overflowX: 'auto' }}>
          <TableContainer component={Box}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order ID</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <TableRow key={order.order_id} hover>
                      <TableCell component="th" scope="row">
                        {order.order_id}
                      </TableCell>
                      <TableCell>
                        {new Date(order.order_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => router.push(`/orders/${order.order_id}`)}
                        >
                          <ArrowForwardIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary" sx={{ py: 2 }}>
                        No recent orders available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Container>
  );
}