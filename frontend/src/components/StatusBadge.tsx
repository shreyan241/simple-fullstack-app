import React from 'react';
import { Chip } from '@mui/material';
import { 
  LocalShipping as ShippingIcon,
  CheckCircle as DeliveredIcon,
  Warning as WarningIcon,
  Inventory as InventoryIcon,
  AccessTime as PendingIcon,
  Navigation as NavigationIcon
} from '@mui/icons-material';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
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