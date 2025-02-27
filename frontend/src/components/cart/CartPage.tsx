import { Box, Button, Container, Divider, Grid, Typography } from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import useCartData from "../../hooks/useCartData";
import { CartItem } from "../../types";
import CheckoutButton from "./CheckoutButton";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CartPage () {
    const { cartItems, removeFromCart, refetchCart } = useCartData();

    const groupBySeller = (cartItems: CartItem[]): { [sellerId: string]: CartItem[] } => {
        return cartItems.reduce((groups, item) => {
            const sellerId = item.seller_id;
            if (!groups[sellerId]) {
                groups[sellerId] = [];
            }
            groups[sellerId].push(item);
            return groups;
        }, {} as { [sellerId: string]: CartItem[] });
    };

    const groupedCartItems = groupBySeller(cartItems);

    const handleRemove = async (itemId: number) => {
        await removeFromCart(itemId);
        refetchCart();
      };

    return (
        <Container maxWidth="lg" sx={{ py: 4, pt: 14 }}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>

            {Object.entries(groupedCartItems).map(([sellerId, items]) => (
                <Box
                  key={sellerId}
                  sx={{
                    mb: 4,
                    p: 3,
                    border: '1px solid #ccc',
                    borderRadius: "12px",
                    backgroundColor: "#fff",
                    boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)"
                  }}>
                    {/* Seller Info */}
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#555'}}>
                        Sold by: {items[0].seller_name || "Unknown Seller"}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    {/* Items List */}                    
                    {items.map(item => (
                        <Grid container spacing={2} alignItems="center" key={item.id} sx={{ mb: 3 }}>
                            {/* Item Image */}
                            <Grid item xs={2}>
                                <img
                                  src={item.showcase_img_urls && item.showcase_img_urls.length > 0 ? item.showcase_img_urls[0] : 'https://placehold.co/600x400?text=No+Image+Here'}
                                  alt={item.title}
                                  style={{
                                    width: '100%',
                                    borderRadius: '8px'
                                  }}
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
                                <Button
                                  size="small"
                                  color="error"
                                  startIcon={<DeleteOutlineIcon />}
                                  sx={{ mt: 1 }}
                                  onClick={() => handleRemove(item.id)}
                                >
                                    Remove
                                </Button>
                            </Grid>

                            {/* Item Price */}
                            <Grid item xs={4} textAlign="right">
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                    ${Number(item.price).toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}

                    <Divider sx={{ mb: 2 }} />

                    {/* Checkout Button */}
                    <Box sx={{ textAlign: 'right' }}>
                        <Elements stripe={stripePromise}>
                            <CheckoutButton cartItems={items} />
                        </Elements>
                    </Box>
                </Box>
            ))}

            {cartItems.length === 0 && (
                <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                    Your cart is empty.
                </Typography>
            )}
        </Container>
    );
}

export default CartPage;