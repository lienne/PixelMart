import { Box, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Item } from "../types";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

interface ItemCardProps {
    item: Item;
    noShadow?: boolean;
}

function ItemCard({ item, noShadow }: ItemCardProps) {
    
    return (
        <Card sx={{ minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', boxShadow: noShadow ? 'none' : undefined }}>
            <CardActionArea component={RouterLink} to={`/item/${item.id}`} sx={{ flexGrow: 1 }}>
                {(
                    <CardMedia
                      component="img"
                      height="140"
                      image={item.showcase_img_urls && item.showcase_img_urls.length > 0 ? item.showcase_img_urls[0] : 'fallback-image-url.jpg'}
                      alt={item.title}
                    />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div">
                        {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        ${item.price}
                    </Typography>
                </CardContent>
            </CardActionArea>

            {/* Cart Button */}
            <Box sx={{ mt: 'auto' }}>
                <CardActions sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                    {/* Wishlist Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1 }}>
                        <WishlistButton item={item} />
                    </Box>

                    <AddToCartButton item={item} />
                </CardActions>
            </Box>
        </Card>
    );
}

export default ItemCard;