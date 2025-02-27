import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface OrderDetails {
    id: string;
    user_id: string;
    stripe_session_id: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: Array<{
        id: number;
        title: string;
        price: number;
        showcase_img_urls: string[];
        downloadLink: string; //pre-signed URL for download
    }>;
}

function CheckoutSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getAccessTokenSilently } = useAuth0();
    const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Extract session_id from the query string
    const queryParams = new URLSearchParams(location.search);
    const sessionId = queryParams.get("session_id");

    useEffect(() => {
        if (!sessionId) {
            setError("Missing session id.");
            setLoading(false);
            return;
        }

        // Fetch order details from the backend using the session_id
        const fetchOrderDetails = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/session/${sessionId}?includeDownloadLinks=true`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch order details.");
                }

                const data = await response.json();
                setOrderDetails(data);
            } catch (err: any) {
                setError(err.message || "An error occurred while retrieving your order.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [sessionId, getAccessTokenSilently]);

    if (loading) {
        return (
            <Container sx={{ py: 4, pt: 14, textAlign: "center" }}>
              <CircularProgress />
              <Typography>Loading order details...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
          <Container sx={{ py: 4, pt: 14, textAlign: "center" }}>
            <Typography variant="h5" color="error">{error}</Typography>
            <Button variant="contained" onClick={() => navigate("/cart")} sx={{ mt: 2 }}>
              Back to Cart
            </Button>
          </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4, pt: 14 }}>
            {/* Success Message */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h4" color="primary" gutterBottom>
                    Thank you for your purchase!
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#555' }}>
                    Your order has been successfully processed. Below are your downloads:
                </Typography>
            </Box>
            
            {/* Order Summary */}
            <Box sx={{ backgroundColor: '#f9f9f9', p: 3, borderRadius: '12px', boxShadow: "0px 2px 6px rgba(0,0,0,0.1)", mb: 4 }}>
                <Typography variant="h5" fontWeight="bold">
                    Order Summary
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                    Order ID: {orderDetails?.id} | Total: <strong>${Number(orderDetails?.total_amount).toFixed(2)}</strong>
                </Typography>
            </Box>

            {/* Ordered Items */}
            {orderDetails?.items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    mb: 3,
                    p: 3,
                    border: '1px solid #ddd',
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
                  }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Item Image */}
                        <Grid item xs={2}>
                            <img
                                src={item.showcase_img_urls && item.showcase_img_urls.length > 0 ? item.showcase_img_urls[0] : "https://placehold.co/600x400?text=No+Image+Here"}
                                alt={item.title}
                                style={{ width: '100%', borderRadius: '8px' }}
                            />
                        </Grid>

                        {/* Item Details */}
                        <Grid item xs={6}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Digital Product
                            </Typography>
                        </Grid>

                        {/* Price */}
                        <Grid item xs={2} textAlign="right">
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                ${Number(item.price).toFixed(2)}
                            </Typography>
                        </Grid>

                        {/* Download Button */}
                        <Grid item xs={2} textAlign="right">
                            <Button
                              variant="contained"
                              color="primary"
                              href={item.downloadLink}
                              target="_blank"
                            >
                                Download
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            ))}

            {/* Go to Dashboard Button */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button variant="contained" color="primary" onClick={() => navigate("/dashboard")} sx={{ width: 200 }}>
                    Go to Dashboard
                </Button>
            </Box>
        </Container>
    );
}

export default CheckoutSuccess;