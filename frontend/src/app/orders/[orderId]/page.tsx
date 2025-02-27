'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Button,
  Alert,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Link,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';

import { StatusBadge } from '@/components/StatusBadge';
import { getOrderDetails, Order } from '@/services';

export default function OrderDetails() {
  const { user, isLoading: isUserLoading } = useUser();
  const router = useRouter();
  const params = useParams();
  const orderId = params?.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load order details
  const loadOrderDetails = async () => {
    if (!orderId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getOrderDetails(orderId);
      
      if (response.error) {
        setError(response.error);
        return;
      }

      if (response.data) {
        setOrder(response.data);
      }
    } catch (err) {
      setError('Failed to load order details');
      console.error('Error loading order details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    if (isUserLoading || !user) return;
    loadOrderDetails();
  }, [orderId, isUserLoading, user]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [isUserLoading, user, router]);

  // Handle refresh
  const handleRefresh = () => {
    loadOrderDetails();
  };

  // Format date with timezone
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format timestamp with timezone
  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get shipment status step
  const getShipmentStatusStep = (status: string) => {
    switch (status) {
      case 'Processing':
        return 0;
      case 'In Transit':
        return 1;
      case 'Out for Delivery':
        return 2;
      case 'Delivered':
        return 3;
      case 'Failed':
      case 'Delayed':
        return -1; // Special handling
      default:
        return 0;
    }
  };

  // Loading state
  if (isUserLoading || !user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header with back button, title, and actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton 
            onClick={() => router.push('/dashboard')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" gutterBottom>
            Order Details
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            startIcon={<RefreshIcon />} 
            variant="outlined" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            Refresh
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

      {/* Error alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading indicator */}
      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading order information...
          </Typography>
        </Box>
      ) : !order ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          Order information not found.
        </Alert>
      ) : (
        <>
          {/* Order Summary Card */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              mb: 4, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Order #{order.order_id}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Date:</strong> {formatDate(order.order_date)}
                </Typography>
                <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                  <strong>Status:</strong> <StatusBadge status={order.status} />
                </Typography>
                <Typography variant="body1">
                  <strong>Shipments:</strong> {order.shipments.length}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Box>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    Estimated Delivery:
                  </Typography>
                  {order.shipments.length > 0 ? (
                    <Typography variant="body1">
                      {formatDate(order.shipments[0].estimated_delivery)}
                    </Typography>
                  ) : (
                    <Typography variant="body1">Not available</Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Shipments */}
          {order.shipments.map((shipment, index) => (
            <Paper 
              key={shipment.shipment_id}
              elevation={0} 
              sx={{ 
                mb: 4, 
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                overflow: 'hidden'
              }}
            >
              <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
                <Typography variant="h6">
                  Shipment #{index + 1}
                </Typography>
              </Box>
              
              {/* Shipment Status */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>ID:</strong> {shipment.shipment_id}
                    </Typography>
                    <Typography variant="body1" component="div" sx={{ mb: 1 }}>
                      <strong>Status:</strong> <StatusBadge status={shipment.current_status} />
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Tracking:</strong> {' '}
                      <Link href={`https://track.amazon.com/${shipment.tracking_number}`} target="_blank" rel="noopener">
                        {shipment.tracking_number}
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Shipped:</strong> {formatDate(shipment.ship_date)}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Expected Delivery:</strong> {formatDate(shipment.estimated_delivery)}
                    </Typography>
                    {shipment.actual_delivery_date && (
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Delivered:</strong> {formatDate(shipment.actual_delivery_date)}
                      </Typography>
                    )}
                  </Grid>
                </Grid>

                {/* Tracking Stepper */}
                <Box sx={{ mt: 4, mb: 3 }}>
                  <Stepper 
                    activeStep={getShipmentStatusStep(shipment.current_status)} 
                    alternativeLabel
                    sx={{
                      '& .MuiStepLabel-root.Mui-error': { color: 'error.main' },
                      '& .MuiStepLabel-root.Mui-warning': { color: 'warning.main' },
                    }}
                  >
                    <Step>
                      <StepLabel>Processing</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>In Transit</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Out for Delivery</StepLabel>
                    </Step>
                    <Step>
                      <StepLabel>Delivered</StepLabel>
                    </Step>
                  </Stepper>

                  {/* Special statuses */}
                  {(shipment.current_status === 'Delayed' || shipment.current_status === 'Failed') && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                      <Chip 
                        label={shipment.current_status === 'Delayed' ? 'Shipment Delayed' : 'Delivery Failed'} 
                        color={shipment.current_status === 'Delayed' ? 'warning' : 'error'} 
                        variant="outlined"
                        icon={<WarningIcon />}
                      />
                      {shipment.delivery_failure_status && (
                        <Typography color="error" sx={{ mt: 1 }}>
                          {shipment.delivery_failure_status}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Last Scan Information */}
                <Paper 
                  variant="outlined" 
                  sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}
                >
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationIcon sx={{ mr: 1 }} />
                    Last Scan Information
                  </Typography>
                  <Typography variant="body2">
                    <strong>Location:</strong> {shipment.last_scan_location || 'Not available'}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Time:</strong> {formatTimestamp(shipment.scan_timestamp)}
                  </Typography>
                  {shipment.delivery_attempt_status && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      <strong>Note:</strong> {shipment.delivery_attempt_status}
                    </Typography>
                  )}
                </Paper>

                {/* Fulfillment Details */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Fulfillment Details
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Type:</strong> {shipment.fulfillment_type}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Region:</strong> {shipment.fulfillment_region}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Warehouse:</strong> {shipment.warehouse_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom>
                      Shipping Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Address ID:</strong> {shipment.address_id}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>ZIP Code:</strong> {shipment.zip_code}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Items Table */}
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                  Items in this Shipment
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell align="right">Quantity</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {shipment.items.map((item, i) => (
                        <TableRow key={`${shipment.shipment_id}-item-${i}`} hover>
                          <TableCell>{item.item_name}</TableCell>
                          <TableCell align="right">{item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          ))}
        </>
      )}
    </Container>
  );
} 