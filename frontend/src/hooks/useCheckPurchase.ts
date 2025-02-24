import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useCheckPurchase = (fileId: string) => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [hasPurchased, setHasPurchased] = useState(false);

    useEffect(() => {
        const fetchPurchaseStatus = async () => {
            if (!user) return;

            try {
                const token = await getAccessTokenSilently();
                const auth0Id = user.sub ? encodeURIComponent(user.sub) : "";
                const response = await fetch(`${API_BASE_URL}/orders/${auth0Id}/has-purchased/${fileId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to check purchase status.");
                }

                const data = await response.json();
                setHasPurchased(data.hasPurchased);
            } catch (err) {
                console.error("Error checking purchase status: ", err);
            }
        };

        fetchPurchaseStatus();
    }, [fileId, user, getAccessTokenSilently]);

    return hasPurchased;
}