import { Item } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../context/ProfileContext";

const useWishlist = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { profile } = useContext(ProfileContext);
    const [wishlistItems, setWishlistItems] = useState<Item[]>([]);

    const fetchWishlist = async () => {
        if (isAuthenticated && profile?.id) {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${API_BASE_URL}/users/${profile.id}/wishlist`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setWishlistItems(Array.isArray(data.wishlistItems) ? data.wishlistItems : []);
                } else {
                    console.error("Failed to fetch wishlist items.");
                }
            } catch (err) {
                console.error("Error fetching wishlist:", err);
            }
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [isAuthenticated, profile?.id]);

    const addToWishlist = async (item: Item) => {
        if (isAuthenticated && profile?.id) {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${API_BASE_URL}/users/${profile.id}/wishlist`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ fileId: item.id }),
                });

                if (response.ok) {
                    fetchWishlist();
                } else {
                    console.error("Failed to add item to wishlist.");
                }
            } catch (err) {
                console.error("Error adding to wishlist:", err);
            }
        }
    };

    const removeFromWishlist = async (itemId: number) => {
        if (isAuthenticated && profile?.id) {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${API_BASE_URL}/users/${profile.id}/wishlist/${itemId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    fetchWishlist();
                } else {
                    console.error("Failed to remove item from wishlist.");
                }
            } catch (err) {
                console.error("Error removing item from wishlist:", err);
            }
        }
    };

    const isInWishlist = (itemId: number): boolean =>
        wishlistItems.some((wishlistItem: Item) => wishlistItem.id === itemId);

    return { wishlistItems, fetchWishlist, addToWishlist, removeFromWishlist, isInWishlist };
}

export default useWishlist;