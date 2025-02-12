import { useEffect, useState } from "react";
import { Item } from "../types";

const usePopularItemsFetch = () => {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [isLoading, setIsLoading] = useState(true);
    const [popularItems, setPopularItems] = useState<Item[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPopularItems() {
            try {
                const response = await fetch(`${API_BASE_URL}/files/public/popular`);

                if (!response.ok) {
                    throw new Error("Failed to fetch popular items.");
                }

                const data = await response.json();
                setPopularItems(data.files || []);
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setIsLoading(false);
            }
        }

        fetchPopularItems();
    }, [API_BASE_URL]);

    return { popularItems, isLoading, error };
}

export default usePopularItemsFetch;