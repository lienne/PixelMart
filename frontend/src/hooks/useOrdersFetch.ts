import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Order } from '../types';

// Possibly rewrite with react query
const useOrdersFetch = () => {
    const { user, getAccessTokenSilently } = useAuth0();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;

            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/user/${user.sub}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch orders.");
                }

                const data = await response.json();
                setOrders(data.orders);
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [getAccessTokenSilently, user]);

    return { orders, loading, error };
}

export default useOrdersFetch;