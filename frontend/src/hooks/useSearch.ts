import { useEffect, useState } from "react";
import { Item } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useSearch = (initialQuery = "", sellerId = null) => {
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setLoading(true);

            try {
                const url = sellerId
                    ? `${API_BASE_URL}/users/${sellerId}/search?query=${encodeURIComponent(query)}`
                    : `${API_BASE_URL}/search?query=${encodeURIComponent(query)}`;
            
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error("Failed to fetch search results.");
                }

                const data = await response.json();
                setResults(data.listings);
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, sellerId]);

    return { query, setQuery, results, loading, error };
}