import { Box, Button, Container, Grid, MenuItem, Typography } from "@mui/material";
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
        <Container maxWidth="md" sx={{ py: 4, pt: 14, justifyItems: 'center' }}>
            <Typography variant="h4" gutterBottom>
                Your Cart
            </Typography>
            {Object.entries(groupedCartItems).map(([sellerId, items]) => (
                <Box key={sellerId} sx={{ mb: 4, border: '1px solid #ccc', p: 2 }}>
                    {/* Render items for this seller */}
                    <Grid container spacing={2}>
                        {items.map(item => (
                            <MenuItem key={item.id} sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <img src={item.showcase_img_urls && item.showcase_img_urls.length > 0 ? item.showcase_img_urls[0] : 'fallback-image-url.jpg'} alt={item.title} width="40" height="40" />
                                    <Typography variant="body2">{item.title}</Typography>
                                </Box>
                                <Button
                                    size="small"
                                    color="error"
                                    onClick={() => handleRemove(item.id)}
                                >
                                    <DeleteOutlineIcon />
                                </Button>
                            </MenuItem>
                        ))}
                    </Grid>
                    <Elements stripe={stripePromise}>
                        <CheckoutButton cartItems={items} />
                    </Elements>
                </Box>
            ))}
        </Container>
    );
}

export default CartPage;