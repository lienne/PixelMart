import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { CartProps, Item } from "../types";
import useLocalStorageState from "use-local-storage-state";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface ItemCardProps {
    item: Item;
    noShadow?: boolean;
}

function ItemCard({ item, noShadow }: ItemCardProps) {
    const [cart, setCart] = useLocalStorageState<CartProps>('cart',{ defaultValue: {} });
    const [wishlist, setWishlist] = useLocalStorageState<{ [key: number]: Item }>('wishlist', { defaultValue: {} });

    console.log("Cart state:", cart);
    console.log("Wishlist state:", wishlist);

    const addToCart = (product: Item) => {
        const updatedProduct = { ...product, quantity: 1};

        setCart((prevCart) => ({
            ...prevCart,
            [product.id]: updatedProduct,
        }));
    };

    const toggleWishlist = (product: Item) => {
        setWishlist(prevWishlist => {
            const updatedWishlist = { ...prevWishlist};
            if (updatedWishlist[product.id]) {
                delete updatedWishlist[product.id]; // Remove if already in wishlist
            } else {
                updatedWishlist[product.id] = product; // Add if not in wishlist
            }

            return updatedWishlist;
        });
    };

    const isInCart = (productId: number): boolean =>
        Object.keys(cart ?? {}).includes(productId.toString());

    const isInWishlist = (productId: number): boolean =>
        Object.keys(wishlist ?? {}).includes(productId.toString());
    
    return (
        <Card sx={{ minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxShadow: noShadow ? 'none' : undefined }}>
            <CardActionArea component={RouterLink} to={`/item/${item.id}`} sx={{ flexGrow: 1 }}>
                {(
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.thumbnail}
                      alt={item.title}
                    />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                        {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Price: ${item.price}
                    </Typography>
                </CardContent>
            </CardActionArea>

            {/* Cart Button */}
            <Box sx={{ mt: 'auto' }}>
                <CardActions sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                    {/* Wishlist Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                        <IconButton onClick={() => toggleWishlist(item)} color="error">
                            {isInWishlist(item.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>

                    <Button
                      size="small"
                      fullWidth
                      disabled={isInCart(item.id)}
                      onClick={() => addToCart(item)}
                    >
                        {isInCart(item.id) ? 'In Cart' : 'Add to Cart'}
                    </Button>
                </CardActions>
            </Box>
        </Card>
    );
}

export default ItemCard;