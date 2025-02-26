import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RatingData {
    overallRating: number;
    breakdown: { [key: string]: number };
}

function useRatingsFetch(itemId: string | undefined) {
    const [ratings, setRatings] = useState<RatingData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (itemId) {
            fetchRatings(itemId);
        } else {
            setLoading(false);
        }
    }, [itemId]);

    async function fetchRatings(id: string) {
        try {
            const response = await fetch(`${API_BASE_URL}/items/${id}/ratings`);
            if (!response.ok) {
                throw new Error("Failed to fetch ratings.");
            }

            const data = await response.json();
            setRatings(data);
        } catch (err: any) {
            setError(err.message || "Error fetching ratings.");
        } finally {
            setLoading(false);
        }
    }

    return { ratings, loading, error };
}

export default useRatingsFetch;