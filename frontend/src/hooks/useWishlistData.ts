import { useAuth0 } from "@auth0/auth0-react";
import { Item } from "../types";
import { useContext } from "react";
import { ProfileContext } from "../context/ProfileContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchWishlist = async (userId: string, token: string): Promise<Item[]> => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/wishlist`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    
    const data = await response.json();
    return Array.isArray(data.wishlistItems) ? data.wishlistItems : [];
};

function useWishlistData() {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const { profile } = useContext(ProfileContext);
    const queryClient = useQueryClient();

    const { data: wishlistItems = [], refetch } = useQuery<Item[]>({
        queryKey: ['wishlist', profile?.id],
        queryFn: async () => {
            if (!isAuthenticated || !profile?.id) {
                return [];
            }
            const token = await getAccessTokenSilently();
            return fetchWishlist(profile.id, token);
        },
        enabled: isAuthenticated && !!profile?.id,
    });

    const addToWishlistMutation = useMutation<any, Error, Item>({
        mutationFn: async (item: Item) => {
            if (!isAuthenticated || !profile?.id) {
                throw new Error("Not authenticated.");
            }
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/users/${profile.id}/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ fileId: item.id }),
            });

            if (!response.ok) {
                throw new Error("Failed to add item to wishlist.");
            }

            return response.json();
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['wishlist', profile?.id] });
        },
    });

    const removeFromWishlistMutation = useMutation<any, Error, number>({
        mutationFn: async (itemId: number) => {
            if (!isAuthenticated || !profile?.id) {
                throw new Error("Not authenticated.");
            }
            const token = await getAccessTokenSilently();
            const response = await fetch(`${API_BASE_URL}/users/${profile.id}/wishlist/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to remove item from wishlist.");
            }
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['wishlist', profile?.id] });
        },
    });

    const isInWishlist = (itemId: number): boolean =>
        wishlistItems.some((wishlistItem) => wishlistItem.id === itemId);

    return {
        wishlistItems,
        refetchWishlist: refetch,
        addToWishlist: addToWishlistMutation.mutateAsync,
        removeFromWishlist: removeFromWishlistMutation.mutateAsync,
        isInWishlist,
    };
};

export default useWishlistData;
