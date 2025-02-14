import { CardContent, Typography } from "@mui/material";
import { Item } from "../types";
import AddToCartButton from "./AddToCartButton";
import MuiLink from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";

function ItemDetails({ item }: { item: Item }) {
    return (
        <CardContent>
            <Typography variant="h4" gutterBottom>
                {item.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {item.description}
            </Typography>
            {item.uploader_username && (
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Sold by{" "}
                    <MuiLink component={RouterLink} to={`/profile/${item.uploader_username}`}>
                        {item.uploader_username}
                    </MuiLink>
                </Typography>
            )}
            <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                ${item.price}
            </Typography>

            {/* Add to Cart Button */}
            <AddToCartButton item={item} />
        </CardContent>
);
}

export default ItemDetails;