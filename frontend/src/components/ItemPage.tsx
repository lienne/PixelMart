import { useParams } from "react-router-dom";
import { Container, Typography, Grid } from "@mui/material";
import useLocalStorageState from 'use-local-storage-state';
import { CartProps } from "../types/cartTypes";
import { useSingleItemFetch } from "../hooks/useSingleItemFetch";
import ItemDetails from "./ItemDetails";
import ItemImageCarousel from "./ItemImageCarousel";

function ItemPage() {
    const { itemId } = useParams<{ itemId: string }>();
    const { item } = useSingleItemFetch(itemId);
    const [cart, setCart] = useLocalStorageState<CartProps>('cart', { defaultValue: {} });

    // Handle adding to cart
    const addToCart = () => {
        if (item) {
            setCart((prevCart) => ({
                ...prevCart,
                [item.id]: { ...item },
            }));
        }
    };

    if (!item) {
        return (
            <Container sx={{ py: 4, pt: 14 }}>
                <Typography>Loading item details...</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4, pt: 14 }}>
            <Grid container spacing={4}>
                {/* Left side: Image Carousel */}
                <Grid item xs={12} md={6}>
                    <ItemImageCarousel images={item.images} />
                </Grid>

                {/* Right side: item Details */}
                <Grid item xs={12} md={6}>
                    <ItemDetails item={item} cart={cart} addToCart={addToCart} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default ItemPage;