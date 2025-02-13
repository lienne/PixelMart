import useLocalStorageState from "use-local-storage-state";
import { Item } from "../types";

const useWishlist = () => {
    const [wishlist, setWishlist] = useLocalStorageState<{ [key: number]: Item }>('wishlist', { defaultValue: {} });

    const toggleWishlist = (item: Item) => {
        setWishlist(prevWishlist => {
            const updatedWishlist = { ...prevWishlist};
            if (updatedWishlist[item.id]) {
                delete updatedWishlist[item.id]; // Remove if already in wishlist
            } else {
                updatedWishlist[item.id] = item; // Add if not in wishlist
            }

            return updatedWishlist;
        });
    };

    const isInWishlist = (itemId: number): boolean =>
        Object.keys(wishlist ?? {}).includes(itemId.toString());

    return { wishlist, toggleWishlist, isInWishlist };
}

export default useWishlist;