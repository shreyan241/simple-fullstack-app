"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Grid, 
  Card, 
  Avatar,
} from "@mui/material";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import InventoryIcon from "@mui/icons-material/Inventory";
import TimelineIcon from "@mui/icons-material/Timeline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardPreview from "@/components/DashboardPreview";

export default function Home() {
  const { user, isLoading } = useUser();

  const features = [
    {
      title: "Centralized Tracking",
      description: "Monitor all your Amazon orders in a single, intuitive dashboard",
      icon: <ShoppingBasketIcon />
    },
    {
      title: "Delivery Updates",
      description: "Receive accurate, real-time updates on package delivery status",
      icon: <InventoryIcon />
    },
    {
      title: "Spending Analytics",
      description: "Analyze purchasing patterns with detailed spending metrics",
      icon: <TimelineIcon />
    },
    {
      title: "Smart Notifications",
      description: "Get timely alerts for price drops, delays, and successful deliveries",
      icon: <NotificationsActiveIcon />
    }
  ];

  return (
    <>
      {/* Navigation Bar */}
      <AppBar 
        position="fixed" 
        elevation={0}
        sx={{ 
          backgroundColor: 'background.paper', 
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 64 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingBasketIcon 
                sx={{ 
                  mr: 1.5, 
                  color: 'primary.main' 
                }} 
              />
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  letterSpacing: '-0.5px'
                }}
              >
                OrderTrack<Box component="span" sx={{ color: 'primary.main' }}>Pro</Box>
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {isLoading ? (
              <Button 
                variant="outlined" 
                color="primary" 
                disabled
                sx={{ minWidth: 100 }}
              >
                Loading...
              </Button>
            ) : user ? (
              <Button 
                variant="outlined" 
                color="primary"
                href="/api/auth/logout"
                sx={{ minWidth: 100 }}
              >
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="contained" 
                color="primary"
                href="/api/auth/login"
                disableElevation
                sx={{ minWidth: 100 }}
              >
                Sign In
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Top spacing to account for fixed AppBar */}
      <Toolbar />

      {/* Hero Section */}
      <Box 
        sx={{
          position: 'relative',
          bgcolor: 'background.paper',
          color: 'text.primary',
          overflow: 'hidden',
          pt: { xs: 4, md: 8 },
          pb: { xs: 8, md: 12 }
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={8} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ maxWidth: 560, mx: 'auto' }}>
                <Typography 
                  component="h1" 
                  variant="h2" 
                  sx={{ 
                    fontWeight: 800,
                    letterSpacing: '-1px',
                    mb: 2,
                    lineHeight: 1.2
                  }}
                >
                  Simplify Your Amazon Order Tracking
                </Typography>
                <Typography 
                  variant="h6" 
                  color="text.secondary" 
                  sx={{ 
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.5
                  }}
                >
                  A sophisticated platform for businesses and individuals to monitor, analyze, and optimize their Amazon purchases.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    disableElevation
                    href={user ? "/dashboard" : "/api/auth/login"}
                    endIcon={<ArrowForwardIcon />}
                    sx={{ px: 3, py: 1.5 }}
                  >
                    {user ? "Go to Dashboard" : "Get Started"}
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="primary"
                    size="large"
                    sx={{ px: 3, py: 1.5 }}
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  height: { xs: 300, md: 400, lg: 450 },
                  width: '100%',
                  position: 'relative',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
              >
                <DashboardPreview />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Bar */}
      <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>5M+</Typography>
                <Typography variant="body2">Orders Tracked</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>99.9%</Typography>
                <Typography variant="body2">Uptime</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>50K+</Typography>
                <Typography variant="body2">Users</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 700 }}>4.9</Typography>
                <Typography variant="body2">Star Rating</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ mb: 8, textAlign: 'center', maxWidth: 700, mx: 'auto' }}>
            <Typography 
              variant="overline" 
              component="div" 
              color="primary"
              sx={{ 
                mb: 1,
                fontWeight: 600,
                letterSpacing: 1.2
              }}
            >
              KEY FEATURES
            </Typography>
            <Typography 
              variant="h3" 
              component="h2" 
              sx={{ 
                mb: 3,
                fontWeight: 700,
              }}
            >
              Everything you need to manage orders efficiently
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Our platform provides a comprehensive suite of tools designed to streamline your Amazon order tracking process and provide valuable insights.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item key={index} xs={12} sm={6} md={3}>
                <Card
                  elevation={0}
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: '1px solid',
                    borderColor: 'divider',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 'primary.main', 
                        width: 56, 
                        height: 56,
                        mb: 2
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h3"
                      sx={{ fontWeight: 600 }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          bgcolor: 'primary.dark', 
          color: 'primary.contrastText', 
          py: { xs: 8, md: 10 },
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Background pattern */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Ready to elevate your order management?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                fontWeight: 400
              }}
            >
              Join industry leaders who trust our platform for their Amazon order tracking needs.
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              disableElevation
              href={user ? "/dashboard" : "/api/auth/login"}
              sx={{ 
                px: 4, 
                py: 1.5,
                fontSize: 18,
                borderRadius: 2
              }}
            >
              {user ? "Access Dashboard" : "Start Free Trial"}
            </Button>
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              No credit card required. 14-day free trial.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6, borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingBasketIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  OrderTrack<Box component="span" sx={{ color: 'primary.main' }}>Pro</Box>
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Transforming how businesses and individuals manage their Amazon purchases.
              </Typography>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} OrderTrackPro. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Product
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Features
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Pricing
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Integrations
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Support
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Help Center
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Documentation
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Contact Us
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Company
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    About
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Blog
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Careers
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Legal
              </Typography>
              <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Privacy
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Terms
                  </Typography>
                </Box>
                <Box component="li" sx={{ mb: 1 }}>
                  <Typography variant="body2" component="a" href="#" color="text.secondary" sx={{ textDecoration: 'none' }}>
                    Security
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
