import { Item } from "../types";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";

const useCart = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { profile } = useContext(ProfileContext);
    const [cartItems, setCartItems] = useState<Item[]>([]);

    const fetchCart = async () => {
        if (isAuthenticated && profile?.id) {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${API_BASE_URL}/users/${profile.id}/cart`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCartItems(Array.isArray(data.cartItems) ? data.cartItems : []);
                } else {
                    console.error("Failed to fetch cart items.");
                }
            } catch (err) {
                console.error("Error fetching cart:", err);
            }
        }
    };

    useEffect(() => {
        fetchCart();
    }, [isAuthenticated, profile?.id]);

    const addToCart = async (item: Item) => {
        if (isAuthenticated && profile?.id) {
            try {
                const token = await getAccessTokenSilently();
                console.log(token);
                const response = await fetch(`${API_BASE_URL}/users/${profile.id}/cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ fileId: item.id }),
                });

                if (response.ok) {
                    fetchCart();
                } else {
                    console.error("Failed to add item to cart.");
                }
            } catch (err) {
                console.error("Error adding to cart:", err);
            }
        }
    };

    const removeFromCart = async (itemId: number) => {
        if (isAuthenticated && profile?.id) {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${API_BASE_URL}/users/${profile.id}/cart/${itemId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    fetchCart();
                } else {
                    console.error("Failed to remove item from cart.");
                }
            } catch (err) {
                console.error("Error removing item from cart:", err);
            }
        }
    };

    const isInCart = (itemId: number): boolean =>
        cartItems.some((cartItem: Item) => cartItem.id === itemId);

    return { cartItems, fetchCart, addToCart, removeFromCart, isInCart };
}

export default useCart;