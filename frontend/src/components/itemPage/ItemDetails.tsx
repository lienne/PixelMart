import { Box, CardContent, IconButton, Typography } from "@mui/material";
import { Item } from "../../types";
import AddToCartButton from "../cart/AddToCartButton";
import MuiLink from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import RatingBreakdown from "./RatingBreakdown";
import FlagIcon from "@mui/icons-material/Flag";

// Mock rating - fetch from API once ready
const overallRating = 4.5;
const ratingBreakdown = {
    "5": 20,
    "4": 10,
    "3": 5,
    "2": 2,
    "1": 3,
};

function ItemDetails({ item }: { item: Item }) {
    const handleReportProduct = () => {
        console.log("Report product: ", item.id);
    }
    return (
        <CardContent sx={{ position: 'relative' }}>
            <Typography variant="h4" gutterBottom>
                {item.title}
            </Typography>

            {/* Report Button */}
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                <IconButton onClick={handleReportProduct} size="small" color="error">
                    <FlagIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Star Rating Display */}
            <RatingBreakdown overallRating={overallRating} breakdown={ratingBreakdown} />

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