import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface OrderItem {
    id: string;
    file_id: string;
    title: string;
    downloadLink: string;
    price: number;
    seller_id: string;
    seller_name: string;
    previewImage: string;
    created_at: string;
}

interface Order {
    id: string;
    total_amount: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}

const useOrderDetailsFetch = () => {
    const { getAccessTokenSilently } = useAuth0();
    const { orderId } = useParams();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch order details.");
                }

                const data = await response.json();
                setOrder(data);
            } catch (err: any) {
                setError(err.message || "An error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [getAccessTokenSilently, orderId]);

    return { order, loading, error };
}

export default useOrderDetailsFetch;