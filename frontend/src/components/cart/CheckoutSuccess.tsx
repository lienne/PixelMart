import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, CircularProgress, Container, Typography } from "@mui/material";
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
                setError(err.message || "An error occurred.");
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
            <Button variant="contained" onClick={() => navigate("/cart")}>
              Back to Cart
            </Button>
          </Container>
        );
    }

    return (
        <Container sx={{ py: 4, pt: 14 }}>
            <Typography variant="h4" gutterBottom>
                Thank you for your purchase!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Your order has been successfully processed. Below are the details:
            </Typography>
            {orderDetails?.items.map(item => (
                <Box key={item.id} sx={{ border: '1px solid #ccc', p: 2, my: 2 }}>
                    <Typography variant="h6">{item.title}</Typography>
                    <Button variant="outlined" color="primary" href={item.downloadLink} target="_blank">
                        Download
                    </Button>
                </Box>
            ))}
            <Button variant="contained" color="primary" onClick={() => navigate("/dashboard")}>
                Go to Dashboard
            </Button>
        </Container>
    );
}

export default CheckoutSuccess;