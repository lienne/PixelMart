import { useState, useEffect } from "react";
import { Item } from "../types";

const API_URL = 'https://dummyjson.com/products';

function useMultipleItemsFetch() {
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState<Item[]>([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        fetchData();
    })

    async function fetchData() {
        try {
            const response = await fetch(API_URL);

            if (response.ok) {
                const data = await response.json();
                setProducts(data.products);
                setIsLoading(false);
            } else {
                setError(true);
                setIsLoading(false);
            }
        } catch (err) {
            setError(true);
            setIsLoading(false);
        }
    }

    return { products, isLoading, error };
}

export default useMultipleItemsFetch;