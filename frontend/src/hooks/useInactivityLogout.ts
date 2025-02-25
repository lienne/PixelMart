import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30min in milliseconds

const useInactivityLogout = () => {
    const { logout } = useAuth0();

    useEffect(() => {
        let inactivityTimer: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                console.log("User inactive, logging out...");
                logout({ logoutParams: { returnTo: window.location.origin } });
            }, INACTIVITY_LIMIT);
        };

        const eventListeners = ["mousemove", "keydown", "click", "scroll"];

        eventListeners.forEach(event => document.addEventListener(event, resetTimer));
        resetTimer();

        return () => {
            clearTimeout(inactivityTimer);
            eventListeners.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [logout]);
}

export default useInactivityLogout;