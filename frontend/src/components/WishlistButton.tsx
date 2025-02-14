import { IconButton } from "@mui/material";
import useWishlist from "../hooks/useWishlist";
import { Item } from "../types";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface WishlistButtonProps {
    item: Item;
}

function WishlistButton ({ item }: WishlistButtonProps) {
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const inWishlist = isInWishlist(item.id);

    const handleClick = async () => {
        if (inWishlist) {
            await removeFromWishlist(item.id);
        } else {
            await addToWishlist(item);
        }
    }

    return (
        <IconButton onClick={handleClick} color="error">
            {inWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
    );
}

export default WishlistButton;