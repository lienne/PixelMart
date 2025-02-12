import { useState, useEffect } from "react";
import { Item } from "../types";

function useMultipleItemsFetch(userIdentifier: string) {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Item[]>([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`${API_BASE_URL}/files/public/user/${userIdentifier}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch products.");
                }
    
                const data = await response.json();
                setProducts(data.files || []);
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setIsLoading(false);
            }
        }

        if (userIdentifier) {
            fetchData();
        }
    }, [userIdentifier, API_BASE_URL]);

    return { products, isLoading, error };
}

export default useMultipleItemsFetch;