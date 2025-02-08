import { useEffect, useState } from "react";
import { Item } from "../types/itemTypes";

const API_URL = "https://dummyjson.com/products";

export function useSingleItemFetch(itemId: string | undefined) {
    const [item, setItem] = useState<Item | null>(null);

    useEffect(() => {
        if (itemId) {
            fetchItemDetails(itemId);
        }
    }, [itemId]);

    async function fetchItemDetails(id: string) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            const data = await response.json();
            setItem(data);
        } catch (err) {
            console.error("Error fetching item:", err);
        }
    }

    return { item };
}