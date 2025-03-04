import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function useBanCheck() {
    const { user, getAccessTokenSilently, logout } = useAuth0();

    useEffect(() => {
        const checkBanStatus = async () => {
            if (!user) return;

            try {
                const token = await getAccessTokenSilently();
                const response = await fetch(`${API_BASE_URL}/users/public-profile/${user?.sub}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                const data = await response.json();
                if (data.is_banned) {
                    toast.error("Your account has been banned.");
                    logout({ logoutParams: { returnTo: window.location.origin } });
                }
            } catch (err) {
                console.error("Error checking ban status: ", err);
            }
        };

        checkBanStatus();
    }, [user, getAccessTokenSilently, logout])

    return null; // This ensures nothing is rendered in the UI
}

export default useBanCheck;