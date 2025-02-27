"use client";

import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Card,
  CardContent,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Stack,
  Badge
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from '@mui/lab';
import {
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  FilterList as FilterListIcon,
  Replay as ReplayIcon,
  QueryStats as QueryStatsIcon,
  Notifications as NotificationsIcon,
  Map as MapIcon,
  DoNotDisturbOn as DoNotDisturbOnIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';

// Bar chart using pure CSS
const RegionalBarChart = () => (
  <Box sx={{ py: 1, px: 1, height: 135 }}>
    <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 120, gap: '7px', position: 'relative' }}>
      <Box sx={{ position: 'absolute', left: 0, right: 0, height: '1px', bottom: '25%', borderBottom: '1px dashed rgba(0,0,0,0.1)' }} />
      <Box sx={{ position: 'absolute', left: 0, right: 0, height: '1px', bottom: '50%', borderBottom: '1px dashed rgba(0,0,0,0.1)' }} />
      <Box sx={{ position: 'absolute', left: 0, right: 0, height: '1px', bottom: '75%', borderBottom: '1px dashed rgba(0,0,0,0.1)' }} />
      
      {[
        { region: 'Pacific', value: 65, color: '#1976d2' },
        { region: 'Midwest', value: 45, color: '#1976d2' },
        { region: 'Northeast', value: 30, color: '#1976d2' },
        { region: 'Southeast', value: 55, color: '#1976d2' },
        { region: 'West', value: 70, color: '#1976d2' },
        { region: 'South', value: 40, color: '#1976d2' },
      ].map((item, i) => (
        <Tooltip key={i} title={`${item.region}: ${item.value} shipments`} arrow placement="top">
          <Box 
            sx={{
              flex: 1,
              height: `${item.value}%`,
              bgcolor: item.color,
              borderRadius: '3px 3px 0 0',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scaleY(1.03)',
              },
              cursor: 'pointer',
            }}
          />
        </Tooltip>
      ))}
    </Box>
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        mt: 1.5,
        px: 0.5,
        '& .MuiTypography-root': { 
          fontSize: '0.65rem', 
          color: 'text.secondary',
          fontWeight: 500
        }
      }}
    >
      <Typography>PAC</Typography>
      <Typography>MW</Typography>
      <Typography>NE</Typography>
      <Typography>SE</Typography>
      <Typography>W</Typography>
      <Typography>S</Typography>
    </Box>
  </Box>
);

// Status distribution chart
const StatusChart = () => (
  <Box sx={{ position: 'relative', height: 140, pt: 1, pb: 2 }}>
    <Box 
      sx={{ 
        height: 120, 
        width: 120,
        position: 'relative',
        mx: 'auto',
        backgroundImage: `conic-gradient(
          #1976d2 0% 40%, 
          #f44336 40% 55%, 
          #ff9800 55% 75%, 
          #4caf50 75% 95%,
          #9e9e9e 95% 100%
        )`,
        borderRadius: '50%',
        boxShadow: '0 4px 14px rgba(0,0,0,0.09)',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          height: '60%',
          borderRadius: '50%',
          bgcolor: 'background.paper',
        }
      }}
    >
      <Box 
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1 }}>40%</Typography>
        <Typography variant="caption" color="text.secondary">In Transit</Typography>
      </Box>
    </Box>
    
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1, mt: 2 }}>
      <Chip
        size="small"
        sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#1976d2', color: 'white' }}
        label="In Transit (40%)"
      />
      <Chip
        size="small"
        sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#f44336', color: 'white' }}
        label="Delayed (15%)"
      />
      <Chip
        size="small"
        sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#ff9800', color: 'white' }}
        label="Out for Delivery (20%)"
      />
      <Chip
        size="small"
        sx={{ height: 20, fontSize: '0.65rem', bgcolor: '#4caf50', color: 'white' }}
        label="Delivered (20%)"
      />
    </Box>
  </Box>
);

// Delivery timeline component
const DeliveryTimeline = () => (
  <Box sx={{ px: 1.5, pt: 0.5, pb: 1 }}>
    <Timeline position="alternate" sx={{ 
      p: 0, 
      m: 0,
      '& .MuiTimelineItem-root': { minHeight: 'auto' },
      '& .MuiTimelineContent-root': { py: 0.5, px: 1 },
      '& .MuiTimelineDot-root': { m: 0.5 }
    }}>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" sx={{ p: 0.5 }}>
            <InventoryIcon sx={{ fontSize: 12 }} />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Order Placed</Typography>
          <Typography variant="caption" display="block" color="text.secondary">Feb 23, 2025</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="primary" variant="outlined" sx={{ p: 0.5 }}>
            <LocalShippingIcon sx={{ fontSize: 12 }} />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>Shipped</Typography>
          <Typography variant="caption" display="block" color="text.secondary">Feb 24, 2025</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="warning" sx={{ p: 0.5 }}>
            <MapIcon sx={{ fontSize: 12 }} />
          </TimelineDot>
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>In Transit</Typography>
          <Typography variant="caption" display="block" color="text.secondary">Phoenix, AZ</Typography>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot sx={{ p: 0.5, bgcolor: '#e0e0e0' }}>
            <CheckCircleIcon sx={{ fontSize: 12, color: '#9e9e9e' }} />
          </TimelineDot>
        </TimelineSeparator>
        <TimelineContent>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>Delivery</Typography>
          <Typography variant="caption" display="block" color="text.secondary">Est. Mar 2, 2025</Typography>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  </Box>
);

// Shipment data based on the provided CSV
const shipments = [
  {
    id: 'SHIP-342',
    trackingNumber: 'A4149627-2A6F-4',
    orderDate: '2025-02-03',
    orderId: '885-2179756',
    product: 'Dell PowerEdge R750 Server',
    quantity: 5,
    status: 'In Transit',
    statusColor: 'info',
    location: 'Austin, TX',
    lastUpdate: '2025-02-23',
    estimatedDelivery: '2025-02-26',
    fulfillmentType: 'Freight',
    deliveryAttempt: 'Third Attempt',
  },
  {
    id: 'SHIP-110',
    trackingNumber: '38D91691-6DE9-4',
    orderDate: '2025-02-11',
    orderId: '100-9569551',
    product: 'Steelcase Gesture Chair',
    quantity: 6,
    status: 'In Transit',
    statusColor: 'info',
    location: 'El Paso, TX',
    lastUpdate: '2025-02-23',
    estimatedDelivery: '2025-02-27',
    fulfillmentType: 'Expedited',
    deliveryAttempt: 'Third Attempt',
  },
  {
    id: 'SHIP-551',
    trackingNumber: '1C95A4C5-4215-4',
    orderDate: '2025-02-20',
    orderId: '324-9232470',
    product: 'Apple MacBook Pro 14',
    quantity: 6,
    status: 'Out for Delivery',
    statusColor: 'warning',
    location: 'Indianapolis, IN',
    lastUpdate: '2025-02-23',
    estimatedDelivery: '2025-02-28',
    fulfillmentType: 'Standard',
    deliveryAttempt: 'First Attempt',
  },
  {
    id: 'SHIP-248',
    trackingNumber: '0DC39BC5-1AEE-4',
    orderDate: '2025-02-14',
    orderId: '231-6588838',
    product: 'Dell XPS 15 Laptop',
    quantity: 8,
    status: 'Delayed',
    statusColor: 'error',
    location: 'San Jose, CA',
    lastUpdate: '2025-02-18',
    estimatedDelivery: '2025-02-18',
    fulfillmentType: 'Standard',
    deliveryAttempt: 'Second Attempt',
  },
  {
    id: 'SHIP-781',
    trackingNumber: '7BA92D34-5F11-4',
    orderDate: '2025-02-18',
    orderId: '573-8812467',
    product: 'Samsung 49" Odyssey G9 Monitor',
    quantity: 2,
    status: 'Delivered',
    statusColor: 'success',
    location: 'Boston, MA',
    lastUpdate: '2025-02-22',
    estimatedDelivery: '2025-02-23',
    fulfillmentType: 'Premium',
    deliveryAttempt: 'First Attempt',
  },
  {
    id: 'SHIP-629',
    trackingNumber: '5FC217A3-9B80-4',
    orderDate: '2025-02-16',
    orderId: '112-4567809',
    product: 'NVIDIA RTX 4090 Graphics Card',
    quantity: 3,
    status: 'In Transit',
    statusColor: 'info',
    location: 'Denver, CO',
    lastUpdate: '2025-02-21',
    estimatedDelivery: '2025-02-25',
    fulfillmentType: 'Standard',
    deliveryAttempt: 'None',
  },
  {
    id: 'SHIP-510',
    trackingNumber: '2E7D9C45-3A18-4',
    orderDate: '2025-02-05',
    orderId: '763-1029384',
    product: 'Herman Miller Aeron Chair',
    quantity: 10,
    status: 'Delayed',
    statusColor: 'error',
    location: 'Miami, FL',
    lastUpdate: '2025-02-19',
    estimatedDelivery: '2025-02-15',
    fulfillmentType: 'Freight',
    deliveryAttempt: 'Failed Attempt',
  },
  {
    id: 'SHIP-423',
    trackingNumber: '9D81F362-7C22-4',
    orderDate: '2025-02-21',
    orderId: '845-7651209',
    product: 'Sony WH-1000XM5 Headphones',
    quantity: 15,
    status: 'Out for Delivery',
    statusColor: 'warning',
    location: 'Portland, OR',
    lastUpdate: '2025-02-23',
    estimatedDelivery: '2025-02-24',
    fulfillmentType: 'Expedited',
    deliveryAttempt: 'First Attempt',
  },
  {
    id: 'SHIP-908',
    trackingNumber: '3F10A8D2-6B43-4',
    orderDate: '2025-02-17',
    orderId: '398-4561278',
    product: 'Secretlab Titan Evo Gaming Chair',
    quantity: 4,
    status: 'Delivered',
    statusColor: 'success',
    location: 'Chicago, IL',
    lastUpdate: '2025-02-22',
    estimatedDelivery: '2025-02-22',
    fulfillmentType: 'Standard',
    deliveryAttempt: 'First Attempt',
  },
  {
    id: 'SHIP-675',
    trackingNumber: '8E56C9D0-2F74-4',
    orderDate: '2025-02-02',
    orderId: '562-8903671',
    product: 'Apple Studio Display',
    quantity: 1,
    status: 'Delivered',
    statusColor: 'success',
    location: 'Seattle, WA',
    lastUpdate: '2025-02-15',
    estimatedDelivery: '2025-02-16',
    fulfillmentType: 'Premium',
    deliveryAttempt: 'First Attempt',
  },
  {
    id: 'SHIP-217',
    trackingNumber: '1A7B3C94-5D32-4',
    orderDate: '2025-02-19',
    orderId: '671-2345097',
    product: 'Lenovo ThinkPad X1 Carbon',
    quantity: 12,
    status: 'In Transit',
    statusColor: 'info',
    location: 'Phoenix, AZ',
    lastUpdate: '2025-02-22',
    estimatedDelivery: '2025-02-27',
    fulfillmentType: 'Standard',
    deliveryAttempt: 'None',
  },
  {
    id: 'SHIP-890',
    trackingNumber: '6D03FE77-8B21-4',
    orderDate: '2025-02-22',
    orderId: '429-7810543',
    product: 'Microsoft Surface Studio 2+',
    quantity: 3,
    status: 'Processing',
    statusColor: 'secondary',
    location: 'Nashville, TN',
    lastUpdate: '2025-02-23',
    estimatedDelivery: '2025-03-01',
    fulfillmentType: 'Priority',
    deliveryAttempt: 'None',
  }
];

// Main component
const DashboardPreview: React.FC = () => {
  return (
    <Box 
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#f8fafc',
        color: 'text.primary',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header with search and user controls */}
      <Box 
        sx={{ 
          p: 1.5, 
          borderBottom: '1px solid', 
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flex: 1,
            bgcolor: '#f1f5f9',
            borderRadius: 1,
            py: 0.5,
            px: 1.5,
            maxWidth: 300
          }}
        >
          <SearchIcon color="action" sx={{ fontSize: 16, mr: 1 }} />
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: '0.75rem' }}
          >
            Search by order ID, tracking number...
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} sx={{ ml: 'auto' }}>
          <Tooltip title="Notifications">
            <IconButton size="small">
              <Badge color="error" badgeContent={3} sx={{ '& .MuiBadge-badge': { fontSize: '10px', height: 14, minWidth: 14 } }}>
                <NotificationsIcon fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Settings">
            <IconButton size="small">
              <SettingsIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Main content area */}
      <Box 
        sx={{ 
          p: { xs: 1.5, sm: 2 },
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Dashboard header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
              Shipment Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
              Overview of your Amazon order shipments
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              size="small" 
              label="Last 30 Days" 
              sx={{ 
                height: 24, 
                borderRadius: 1,
                fontSize: '0.7rem',
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider'
              }}
              deleteIcon={<FilterListIcon fontSize="small" />}
              onDelete={() => {}}
            />
            <Tooltip title="Refresh data">
              <IconButton size="small" sx={{ bgcolor: 'background.paper' }}>
                <ReplayIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Metrics row */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={3}>
            <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
              <CardContent sx={{ p: '12px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontSize: '0.7rem', mb: 0.5, fontWeight: 500 }}
                    >
                      Total Shipments
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      {shipments.length}
                    </Typography>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.light', 
                      width: 28, 
                      height: 28 
                    }}
                  >
                    <InventoryIcon sx={{ color: 'white', fontSize: 16 }} />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                  <ArrowUpwardIcon sx={{ color: 'success.main', fontSize: 12, mr: 0.5 }} />
                  <Typography variant="caption" color="success.main" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                    +3 new this week
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
              <CardContent sx={{ p: '12px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontSize: '0.7rem', mb: 0.5, fontWeight: 500 }}
                    >
                      In Transit
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      4
                    </Typography>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'info.light', 
                      width: 28, 
                      height: 28 
                    }}
                  >
                    <LocalShippingIcon sx={{ color: 'white', fontSize: 16 }} />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.7rem' }}>
                    Avg. 4 days in transit
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
              <CardContent sx={{ p: '12px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontSize: '0.7rem', mb: 0.5, fontWeight: 500 }}
                    >
                      Delayed
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      3
                    </Typography>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'error.light', 
                      width: 28, 
                      height: 28 
                    }}
                  >
                    <WarningIcon sx={{ color: 'white', fontSize: 16 }} />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                  <ArrowUpwardIcon sx={{ color: 'error.main', fontSize: 12, mr: 0.5 }} />
                  <Typography variant="caption" color="error.main" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                    +2 since yesterday
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={3}>
            <Card variant="outlined" sx={{ borderRadius: 1.5 }}>
              <CardContent sx={{ p: '12px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontSize: '0.7rem', mb: 0.5, fontWeight: 500 }}
                    >
                      Delivery Success
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                      86%
                    </Typography>
                  </Box>
                  <Avatar 
                    sx={{ 
                      bgcolor: 'success.light', 
                      width: 28, 
                      height: 28 
                    }}
                  >
                    <CheckCircleIcon sx={{ color: 'white', fontSize: 16 }} />
                  </Avatar>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                  <ArrowDownwardIcon sx={{ color: 'warning.main', fontSize: 12, mr: 0.5 }} />
                  <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600, fontSize: '0.7rem' }}>
                    -2% from last month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main content grid */}
        <Grid container spacing={2} sx={{ mb: 1, flex: 1 }}>
          {/* Shipment table */}
          <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Card variant="outlined" sx={{ borderRadius: 1.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Recent Shipments
                  </Typography>
                  <Tooltip title="Shipments from the last 30 days">
                    <InfoOutlinedIcon sx={{ fontSize: 14, ml: 0.5, color: 'text.secondary' }} />
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Download CSV">
                    <IconButton size="small" sx={{ p: 0.5 }}>
                      <DownloadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More options">
                    <IconButton size="small" sx={{ p: 0.5 }}>
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TableContainer sx={{ flex: 1, overflowY: 'auto' }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ py: 1, fontWeight: 600, fontSize: '0.75rem' }}>Shipment ID</TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 600, fontSize: '0.75rem' }}>Order Date</TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 600, fontSize: '0.75rem' }}>Product</TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 600, fontSize: '0.75rem' }}>Qty</TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 600, fontSize: '0.75rem' }}>Status</TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 600, fontSize: '0.75rem' }}>Delivery Est.</TableCell>
                      <TableCell sx={{ py: 1, fontWeight: 600, fontSize: '0.75rem' }}>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow 
                        key={shipment.id} 
                        hover
                        sx={{ 
                          '&:last-child td, &:last-child th': { border: 0 },
                          cursor: 'pointer',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                color: 'primary.main'
                              }}
                            >
                              {shipment.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>{shipment.orderDate}</TableCell>
                        <TableCell 
                          sx={{ 
                            py: 1, 
                            fontSize: '0.75rem',
                            maxWidth: 180,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {shipment.product}
                        </TableCell>
                        <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>{shipment.quantity}</TableCell>
                        <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>
                          <Chip
                            label={shipment.status}
                            size="small"
                            color={shipment.statusColor as any}
                            sx={{ 
                              height: 20, 
                              fontSize: '0.7rem', 
                              fontWeight: 600,
                              '& .MuiChip-label': { px: 1 } 
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>{shipment.estimatedDelivery}</TableCell>
                        <TableCell sx={{ py: 1, fontSize: '0.75rem' }}>{shipment.location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box 
                sx={{ 
                  p: 1, 
                  borderTop: '1px solid', 
                  borderColor: 'divider', 
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  Showing {shipments.length} of {shipments.length*2} shipments
                </Typography>
                <Chip 
                  label="View All Shipments" 
                  size="small" 
                  variant="outlined"
                  clickable
                  sx={{ 
                    height: 24,
                    fontSize: '0.7rem',
                    fontWeight: 600, 
                    color: 'primary.main', 
                    borderColor: 'primary.main' 
                  }}
                />
              </Box>
            </Card>
          </Grid>

          {/* Right column - charts and timeline */}
          <Grid item xs={12} lg={4} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Grid container spacing={2} sx={{ height: '100%' }}>
              {/* Regional distribution */}
              <Grid item xs={12} sm={6} lg={12} sx={{ display: 'flex' }}>
                <Card variant="outlined" sx={{ borderRadius: 1.5, width: '100%' }}>
                  <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Fulfillment by Region
                    </Typography>
                    <Tooltip title="Analyze">
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <QueryStatsIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <RegionalBarChart />
                </Card>
              </Grid>

              {/* Status chart */}
              <Grid item xs={12} sm={6} lg={12} sx={{ display: 'flex' }}>
                <Card variant="outlined" sx={{ borderRadius: 1.5, width: '100%' }}>
                  <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Shipment Status
                    </Typography>
                    <Tooltip title="Share">
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <ShareIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <StatusChart />
                </Card>
              </Grid>

              {/* Delivery timeline card */}
              <Grid item xs={12} sx={{ display: 'flex' }}>
                <Card variant="outlined" sx={{ borderRadius: 1.5, width: '100%' }}>
                  <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Tracking Timeline
                      </Typography>
                      <Chip 
                        label="SHIP-342" 
                        size="small" 
                        sx={{ 
                          ml: 1.5, 
                          height: 20, 
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          bgcolor: 'primary.light',
                          color: 'primary.dark',
                        }} 
                      />
                    </Box>
                    <Tooltip title="Problem with delivery">
                      <IconButton size="small" sx={{ p: 0.5 }}>
                        <DoNotDisturbOnIcon fontSize="small" color="error" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <DeliveryTimeline />
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPreview; 