import { Container, Typography, Grid, Box } from "@mui/material";
import useLocalStorageState from "use-local-storage-state";
import { Item } from "../../types";
import ItemCard from "../ItemCard";

function Wishlist() {
    const [wishlist] = useLocalStorageState<{ [key: number]: Item }>('wishlist', { defaultValue: {} });

    // Convert wishlist object to array
    const wishlistItems = Object.values(wishlist);

    return (
        <Container maxWidth="lg" sx={{ py: 4, pt: 14 }}>
            <Typography variant="h4" gutterBottom>
                Your Wishlist
            </Typography>

            {wishlistItems.length > 0 ? (
                <Grid container spacing={3}>
                    {wishlistItems.map((item) => (
                        <Grid item xs={12} sm={6} md={4} key={item.id}>
                            <ItemCard item={item} />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Typography variant="body1">Your wishlist is empty.</Typography>
                </Box>
            )}
        </Container>
    );
}

export default Wishlist;
