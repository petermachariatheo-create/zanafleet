import React, { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  LocalShipping as DeliveryIcon,
  Person as RiderIcon,
  ShoppingBag as ShopperIcon,
  AdminPanelSettings as AdminIcon,
  SupportAgent as SupportIcon,
  Tune as OperatorIcon,
  CheckCircle as CheckIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Hub as HubIcon,
} from '@mui/icons-material';

import { useAuth } from '../../hooks/useAuth';
import { ActorType } from '../../types';

const ROLE_CARDS = [
  {
    actorType: ActorType.BusinessOwner,
    label: 'Business Owner',
    description: 'Grow your delivery operations with real-time tracking and analytics.',
    icon: <DeliveryIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    path: '/signup?actorType=BusinessOwner',
  },
  {
    actorType: ActorType.Rider,
    label: 'Rider / Driver',
    description: 'Earn on your schedule with optimized routes and instant payouts.',
    icon: <RiderIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
    path: '/signup?actorType=Rider',
  },
  {
    actorType: ActorType.Customer,
    label: 'Customer / Shopper',
    description: 'Shop from businesses and track deliveries in real time.',
    icon: <ShopperIcon sx={{ fontSize: 40, color: 'pink.main' }} />,
    path: '/signup?actorType=Customer',
  },
  {
    actorType: ActorType.Admin,
    label: 'Admin',
    description: 'Platform oversight, policy management, and global controls.',
    icon: <AdminIcon sx={{ fontSize: 40, color: 'error.main' }} />,
    path: '/signup?actorType=Admin',
  },
  {
    actorType: ActorType.Support,
    label: 'Support',
    description: 'Resolve disputes, process refunds, and assist users fast.',
    icon: <SupportIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
    path: '/signup?actorType=Support',
  },
  {
    actorType: ActorType.SaccoAdmin,
    label: 'Operator / SACCO',
    description: 'Manage fleets, assign riders, and optimize routes.',
    icon: <OperatorIcon sx={{ fontSize: 40, color: 'success.main' }} />,
    path: '/signup?actorType=SaccoAdmin',
  },
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'Create an account',
    description: 'Choose your role and complete the quick onboarding flow.',
  },
  {
    step: '2',
    title: 'Get matched',
    description: 'Businesses post deliveries. Riders get matched by proximity and capacity.',
  },
  {
    step: '3',
    title: 'Deliver & track',
    description: 'Track every delivery in real time. Payments, ratings, and receipts in one place.',
  },
];

const FEATURES = [
  { icon: <SpeedIcon />, title: 'Real-time tracking', description: 'Live GPS updates for every delivery.' },
  { icon: <SecurityIcon />, title: 'Secure payments', description: 'Encrypted transactions and automated payouts.' },
  { icon: <HubIcon />, title: 'Multi-vendor network', description: 'One platform connecting businesses, riders, and customers.' },
  { icon: <CheckIcon />, title: 'Role-based dashboards', description: 'Purpose-built interfaces for every user type.' },
];

export function LandingPage(): React.ReactElement {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white', py: { xs: 8, md: 12 }, px: 2 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Chip label="Logistics Platform" size="small" sx={{ mb: 2, bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} />
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                One Network. Every Delivery.
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 400 }}>
                ZanaFleet connects businesses, riders, and customers in one multi-vendor delivery platform — built for speed, transparency, and scale.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" size="large" component={RouterLink} to="/signup" sx={{ px: 4, py: 1.5, fontWeight: 600 }}>
                  Get Started
                </Button>
                <Button variant="outlined" size="large" component={RouterLink} to="/signin" sx={{ px: 4, py: 1.5, borderColor: 'rgba(255,255,255,0.4)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                  Sign In
                </Button>
              </Box>
              <Box sx={{ mt: 4, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="h4" fontWeight={700}>6+</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>User roles</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>1</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Unified network</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={700}>24/7</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Tracking & support</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper sx={{ p: 3, bgcolor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
                <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.8 }}>Live Platform Preview</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { status: 'In Transit', from: 'Nairobi CBD', to: 'Westlands', eta: '12 min' },
                    { status: 'Assigned', from: 'Karen', to: 'Junction Mall', eta: '25 min' },
                    { status: 'Delivered', from: 'Kiambu', to: 'Thika Rd', eta: 'Completed' },
                  ].map((item, idx) => (
                    <Paper key={idx} sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.08)' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Chip label={item.status} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>{item.eta}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.from} → {item.to}</Typography>
                    </Paper>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Role Cards */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Built for every part of the delivery network
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Whether you run a business, drive a bike, or need something delivered — ZanaFleet has a dedicated experience for you.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {ROLE_CARDS.map((role) => (
              <Grid item xs={12} sm={6} md={4} key={role.actorType}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                  <CardActionArea component={RouterLink} to={role.path} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        {role.icon}
                        <Chip label={role.actorType} size="small" variant="outlined" />
                      </Box>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                        {role.label}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {role.description}
                      </Typography>
                      <Button variant="text" size="small" sx={{ mt: 'auto', alignSelf: 'flex-start', fontWeight: 600 }}>
                        Join as {role.label.split(' ')[0]} →
                      </Button>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Box sx={{ bgcolor: 'grey.50', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              How it works
            </Typography>
            <Typography variant="body1" color="text.secondary">
              From signup to delivery in three simple steps.
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {HOW_IT_WORKS.map((item) => (
              <Grid item xs={12} md={4} key={item.step}>
                <Paper sx={{ p: 4, height: '100%', textAlign: 'center' }} elevation={0}>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700, mx: 'auto', mb: 2 }}>
                    {item.step}
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
              Platform capabilities
            </Typography>
            <Typography variant="body1" color="text.secondary">
              The infrastructure you need to run logistics at scale.
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {FEATURES.map((feature) => (
              <Grid item xs={12} sm={6} md={3} key={feature.title}>
                <Paper sx={{ p: 3, height: '100%' }} elevation={0}>
                  <Box sx={{ mb: 2, color: 'primary.main' }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Strip */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                Ready to join the network?
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Create an account in minutes and start sending, delivering, or managing.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              <Button variant="contained" size="large" component={RouterLink} to="/signup" sx={{ px: 4, py: 1.5, bgcolor: 'white', color: 'primary.main', fontWeight: 600, '&:hover': { bgcolor: 'grey.100' } }}>
                Get Started
              </Button>
              <Button variant="outlined" size="large" component={RouterLink} to="/signin" sx={{ px: 4, py: 1.5, borderColor: 'rgba(255,255,255,0.6)', color: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                Sign In
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'grey.900', color: 'white', py: { xs: 6, md: 8 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>ZanaFleet</Typography>
              <Typography variant="body2" sx={{ opacity: 0.7, maxWidth: 300 }}>
                Multi-vendor delivery platform powering businesses, riders, and customers across Africa.
              </Typography>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Platform</Typography>
              <List dense sx={{ p: 0 }}>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Business" /></ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Rider" /></ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Shopper" /></ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Operator" /></ListItem>
              </List>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Company</Typography>
              <List dense sx={{ p: 0 }}>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="About" /></ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Contact" /></ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Careers" /></ListItem>
              </List>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Legal</Typography>
              <List dense sx={{ p: 0 }}>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Privacy" /></ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Terms" /></ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Licenses" /></ListItem>
              </List>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>Support</Typography>
              <List dense sx={{ p: 0 }}>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Help Center" /></ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Status" /></ListItem>
                <ListItem sx={{ p: 0, mb: 1 }}><ListItemText primary="Report" /></ListItem>
              </List>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © {new Date().getFullYear()} ZanaFleet. All rights reserved.
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              Built for the multi-vendor delivery ecosystem.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
