import { Button } from "@mui/material";
import useCartData from "../../hooks/useCartData";
import { Item } from "../../types";
import { useContext } from "react";
import { ProfileContext } from "../../context/ProfileContext";

interface AddToCartButtonProps {
    item: Item;
}

function AddToCartButton ({ item }: AddToCartButtonProps) {
    const { profile } = useContext(ProfileContext);
    const { addToCart, isInCart } = useCartData();
    const inCart = isInCart(item.id);

    const isOwnListing = profile?.username === item.uploader_username;

    return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => addToCart(item)}
          disabled={inCart || isOwnListing}
        >
            {isOwnListing ? "Own Listing" : (inCart ? "In Cart" : "Add to Cart")}
        </Button>
    );
}

export default AddToCartButton;