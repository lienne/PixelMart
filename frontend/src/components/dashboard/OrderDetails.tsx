import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useOrderDetailsFetch from "../../hooks/useOrderDetailsFetch";

function OrderDetails() {
    const { order, loading, error } = useOrderDetailsFetch();

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
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (!order) return null;

    return (
        <Container sx={{ py: 4, pt: 14 }}>
            {/* Order Summary Section */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Typography variant="h6">
                    Purchased from <strong>{order.items[0]?.seller_name || "Unknown Seller"}</strong> on{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                </Typography>

                {order.items.map((item) => (
                    <CardContent key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        {/* Item Thumbnail */}
                        <Box
                          component="img"
                          src={item.previewImage}
                          alt={item.title}
                          sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                        />

                        {/* Item Details */}
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography
                              variant="body1"
                              component={RouterLink}
                              to={`/item/${item.file_id}`}
                              sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                                fontWeight: 'bold',
                                '&:hover': { textDecoration: 'underline' },
                              }}
                            >
                                {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                ${Number(item.price).toFixed(2)}
                            </Typography>
                        </Box>

                        {/* Buttons Section */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button variant="contained" color="primary" href={item.downloadLink} target="_blank">
                                Download
                            </Button>
                            <Button variant="outlined" color="secondary">
                                Help with Order
                            </Button>
                        </Box>
                    </CardContent>
                ))}
            </Card>

            <Button variant="contained" color="primary" component={RouterLink} to="/dashboard/orders">
                Back to Orders
            </Button>
        </Container>
    );
}

export default OrderDetails;