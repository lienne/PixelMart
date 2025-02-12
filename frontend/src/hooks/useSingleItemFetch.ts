import { useEffect, useState } from "react";
import { Item } from "../types/itemTypes";

// const API_URL = "https://dummyjson.com/products";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function useSingleItemFetch(itemId: string | undefined) {
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (itemId) {
            fetchItemDetails(itemId);
        }
    }, [itemId]);

    async function fetchItemDetails(id: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/files/${id}`);

            if (!response.ok) {
                throw new Error("Failed to fetch item details.");
            }

            const data = await response.json();
            setItem(data);
        } catch (err: any) {
            setError(err.message || "Error fetching item.");
        } finally {
            setLoading(false);
        }
    }

    return { item, loading, error };
}