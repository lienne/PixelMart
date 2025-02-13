import { IconButton } from "@mui/material";
import useWishlist from "../hooks/useWishlist";
import { Item } from "../types";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface WishlistButtonProps {
    item: Item;
}

function WishlistButton ({ item }: WishlistButtonProps) {
    const { toggleWishlist, isInWishlist } = useWishlist();

    return (
        <IconButton onClick={() => toggleWishlist(item)} color="error">
            {isInWishlist(item.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
    );
}

export default WishlistButton;