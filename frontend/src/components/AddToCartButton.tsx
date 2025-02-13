import { Button } from "@mui/material";
import useCart from "../hooks/useCart";
import { Item } from "../types";

interface AddToCartButtonProps {
    item: Item;
}

function AddToCartButton ({ item }: AddToCartButtonProps) {
    const { addToCart, isInCart } = useCart();
    const inCart = isInCart(item.id);

    return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => addToCart(item)}
          disabled={inCart}
        >
            {inCart ? "In Cart" : "Add to Cart"}
        </Button>
    );
}

export default AddToCartButton;