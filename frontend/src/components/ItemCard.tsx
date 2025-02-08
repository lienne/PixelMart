import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';

interface Item {
    id: number;
    title: string;
    price: string;
    images: string[];
    thumbnail?: string;
    quantity?: number;
}

interface ItemCardProps {
    item: Item;
}

function ItemCard({item}: ItemCardProps) {
    return (
        <Card sx={{ minHeight: 300, display: 'flex', flexDirection: 'column' }}>
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
                        Price: {item.price}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <Box sx={{ mt: 'auto' }}>
                <CardActions>
                    <Button size="small">Add to Cart</Button>
                </CardActions>
            </Box>
        </Card>
    );
}

export default ItemCard;