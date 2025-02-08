import { CardContent, Typography, Button } from "@mui/material";
import { Item, CartProps } from "../types";

interface Props {
    item: Item;
    cart: CartProps;
    addToCart: () => void;
}

function ItemDetails({ item, cart, addToCart }: Props) {
    return (
        <CardContent>
            <Typography variant="h4" gutterBottom>
                {item.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {item.description}
            </Typography>
            <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                ${item.price}
            </Typography>

            {/* Add to Cart Button */}
            <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={addToCart}
                disabled={(cart ?? {})[item.id] !== undefined}
            >
                {(cart ?? {})[item.id] ? "In Cart" : "Add to Cart"}
            </Button>
        </CardContent>
);
}

export default ItemDetails;