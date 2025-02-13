import useLocalStorageState from "use-local-storage-state";
import { CartProps, Item } from "../types";

const useCart = () => {
    const [cart, setCart] = useLocalStorageState<CartProps>('cart', { defaultValue: {} });

    const addToCart = (item: Item) => {
        const updatedProduct = { ...item };
        setCart((prevCart) => ({
            ...prevCart,
            [item.id]: updatedProduct,
        }));
    };

    const isInCart = (itemId: number): boolean =>
        Object.keys(cart ?? {}).includes(itemId.toString());

    return { cart, addToCart, isInCart };
}

export default useCart;