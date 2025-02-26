import { useEffect, useState } from "react";
import { Review } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function useReviewsFetch(itemId: string | undefined) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (itemId) {
            fetchReviews(itemId);
        } else {
            setLoading(false);
        }
    }, [itemId]);

    async function fetchReviews(id: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/items/${id}/reviews`);
            if (!response.ok) {
                throw new Error("Failed to fetch reviews.");
            }

            const data = await response.json();
            setReviews(data.reviews);
        } catch (err: any) {
            setError(err.message || "Error fetching reviews.");
        } finally {
            setLoading(false);
        }
    }

    return { reviews, loading, error };
}

export default useReviewsFetch;