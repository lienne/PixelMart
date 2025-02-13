import { CardContent, Typography } from "@mui/material";
import { Item } from "../types";
import AddToCartButton from "./AddToCartButton";

function ItemDetails({ item }: { item: Item }) {
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
            <AddToCartButton item={item} />
        </CardContent>
);
}

export default ItemDetails;