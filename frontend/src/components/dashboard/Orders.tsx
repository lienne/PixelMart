import { Alert, Box, Button, Card, CardContent, CircularProgress, Container, Typography } from "@mui/material";
import useOrdersFetch from "../../hooks/useOrdersFetch";
import { Link } from "react-router-dom";

function Orders() {
    const { orders, loading, error } = useOrdersFetch();

    if (loading) {
        return (
            <Container sx={{ py: 4, pt: 14, textAlign: "center" }}>
                <CircularProgress />
                <Typography>Loading your orders...</Typography>
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

    return (
        <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
                My Orders
            </Typography>

            {orders.length === 0 ? (
                <Typography>No orders yet.</Typography>
            ) : (
                orders.map((order) => (
                    <Card key={order.id} sx={{ mb: 3, p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6">
                            Purchased from <strong>{order.items[0]?.seller_name || "Unknown Seller"} on{" "}
                            {new Date(order.created_at).toLocaleDateString()}
                            </strong>
                        </Typography>

                        {order.items.map((item) => (
                            <CardContent key={item.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {/* Item Thumbnail */}
                                <Box
                                  component="img"
                                  src={item.previewImage || "https://via.placeholder.com/100"}
                                  alt={item.title}
                                  sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
                                />

                                {/* Item Details */}
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography
                                      variant="body1"
                                      component={Link}
                                      to={`/item/${item.file_id}`}
                                      sx={{
                                        textDecoration: 'none',
                                        color: 'primary.main',
                                        fontWeight: 'bold',
                                        "&:hover": { textDecoration: 'underline' },
                                      }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(item.created_at).toLocaleDateString()} - ${item.price.toFixed(2)}
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
                                    <Button variant="text" component={Link} to={`/receipt/${order.id}`}>
                                        View Receipt
                                    </Button>
                                </Box>
                            </CardContent>
                        ))}
                    </Card>
                ))
            )}
        </Container>
    );
}

export default Orders;