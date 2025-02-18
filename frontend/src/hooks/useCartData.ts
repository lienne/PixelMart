import { useAuth0 } from "@auth0/auth0-react";
import { Item, CartItem } from "../types";
import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchCart = async (userId: string, token: string): Promise<CartItem[]> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/cart`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    return Array.isArray(data.cartItems) ? data.cartItems : [];
};

const useCartData = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { profile } = useContext(ProfileContext);
    const queryClient = useQueryClient();

    const { data: cartItems = [], refetch } = useQuery<CartItem[]>({
        queryKey: ['cart', profile?.id],
        queryFn: async () => {
            if (!isAuthenticated || ! profile?.id) {
                return [];
            }
            const token = await getAccessTokenSilently();
            return fetchCart(profile.id, token);
        },
        enabled: isAuthenticated && !!profile?.id,
    });

    const addToCartMutation = useMutation<any, Error, Item>({
        mutationFn: async (item: Item) => {
            if (!isAuthenticated || !profile?.id) {
                throw new Error("Not authenticated.");
            }
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/users/${profile.id}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ fileId: item.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to add item to cart.");
            }

            return response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['cart', profile?.id] });
        },
    });

    const removeFromCartMutation = useMutation<any, Error, number>({
        mutationFn: async (itemId: number) => {
            if (!isAuthenticated || !profile?.id) {
                throw new Error("Not authenticated.");
            }
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/users/${profile.id}/cart/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error("Failed to remove item from cart.");
            }
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['cart', profile?.id] });
        },
    });

    const isInCart = (itemId: number): boolean =>
        cartItems.some((cartItem) => cartItem.id === itemId);

    return {
        cartItems,
        refetchCart: refetch,
        addToCart: addToCartMutation.mutateAsync,
        removeFromCart: removeFromCartMutation.mutateAsync,
        isInCart,
    };
}

export default useCartData;