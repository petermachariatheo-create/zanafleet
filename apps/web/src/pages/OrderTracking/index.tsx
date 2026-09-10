import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Divider,
    Button,
    Grid,
    CircularProgress,
    Card,
    CardContent,
    Avatar,
    Stack,
    IconButton,
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Chat as ChatIcon,
    Home as HomeIcon,
    Storefront as StoreIcon,
} from '@mui/icons-material';
import { GeoMap, GeoPoint } from '../../components/common';
import { getDelivery } from '../../services/deliveryApi';

const STAGES = ['Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];

export const OrderTrackingPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDelivery = async () => {
            if (!id) return;
            try {
                const delivery = await getDelivery(id);
                setOrder({
                    orderId: delivery.id,
                    status: delivery.status,
                    itemSummary: delivery.itemSummary || 'Order',
                    merchant: { name: 'Store', lat: -1.2864, lng: 36.8172 },
                    customer: { name: 'Customer', lat: -1.2921, lng: 36.8219 },
                    rider: delivery.assignedRiderName ? { name: delivery.assignedRiderName, phone: delivery.assignedRiderPhone || '', lat: -1.2890, lng: 36.8190 } : null,
                    currentStage: Math.min(Math.max(parseInt(delivery.status) || 0, 0), STAGES.length - 1),
                });
            } catch (err) {
                console.error('Failed to fetch delivery', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDelivery();
    }, [id]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    if (!order) return <Container sx={{ mt: 4 }}><Typography>Order not found.</Typography></Container>;

    const mapPoints: GeoPoint[] = [
        { id: 'merchant', lat: order.merchant.lat, lng: order.merchant.lng, label: 'Merchant' },
        { id: 'customer', lat: order.customer.lat, lng: order.customer.lng, label: 'You' },
        { id: 'rider', lat: order.rider.lat, lng: order.rider.lng, label: 'Rider' },
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => navigate('/shop')}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Track Order #{id?.split('-')[0]}</Typography>
            </Box>

            <Grid container spacing={4}>
                {/* Left: Map & Rider Details */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                        <GeoMap
                            points={mapPoints}
                            height={400}
                            ariaLabel="Order tracking map"
                        />
                    </Paper>

                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                                        {order.rider.name[0]}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6">{order.rider.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">Your Delivery Partner</Typography>
                                    </Box>
                                </Box>
                                <Stack direction="row" spacing={1}>
                                    <Button variant="outlined" startIcon={<ChatIcon />} onClick={() => navigate('/messages')}>
                                        Message
                                    </Button>
                                    <Button variant="contained" color="primary">
                                        Call
                                    </Button>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right: Status & Order Details */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>Delivery Progress</Typography>
                        <Stepper activeStep={order.currentStage} orientation="vertical" sx={{ mt: 2 }}>
                            {STAGES.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" gutterBottom>Order Summary</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{order.itemSummary}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Typography color="text.secondary">Total Amount</Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>{order.totalAmount} KES</Typography>
                        </Box>
                        <Box sx={{ mt: 3 }}>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <StoreIcon color="disabled" fontSize="small" />
                                <Typography variant="caption" color="text.secondary">Pickup: {order.merchant.name}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <HomeIcon color="disabled" fontSize="small" />
                                <Typography variant="caption" color="text.secondary">Drop-off: Home (Saved)</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};
