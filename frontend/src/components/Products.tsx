import { Alert, Box, Button, Card, CardActionArea, CardContent, CardMedia, CircularProgress, Grid, Typography } from "@mui/material";
import useLocalStorageState from 'use-local-storage-state';
import { Link as RouterLink } from 'react-router-dom';
import ItemCard from "./ItemCard";
import useMultipleItemsFetch from '../hooks/useMultipleItemsFetch';
import { Item, CartProps } from "../types";

function Products () {
    const { products, isLoading, error } = useMultipleItemsFetch();
    const [cart, setCart] = useLocalStorageState<CartProps>('cart', {});

    const addToCart = (product: Item) => {
        const updatedProduct = { ...product, quantity: 1};

        setCart((prevCart) => ({
            ...prevCart,
            [product.id]: updatedProduct,
        }));
    };

    const isInCart = (productId: number): boolean =>
        Object.keys(cart || {}).includes(productId.toString());

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error">An error occurred when fetching data. Please check the API and try again.</Alert>
        );
    }

    return (
        <Box sx={{ p: 3 }}>

            {/* Product Grid */}
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <CardActionArea component={RouterLink} to={`/item/${product.id}`} sx={{ flexGrow: 1 }}>
                                <CardMedia
                                component="img"
                                height="140"
                                image={product.thumbnail}
                                alt={product.title}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6">{product.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                    Price: {product.price}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <Box sx={{ textAlign: 'center', p: 2 }}>
                                <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isInCart(product.id)}
                                onClick={() => addToCart(product)}
                                >
                                {isInCart(product.id) ? 'In Cart' : 'Add to Cart'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <ItemCard item={product} />
                    </Grid>
                ))}
            </Grid> */}
        </Box>
    );
}

export default Products;