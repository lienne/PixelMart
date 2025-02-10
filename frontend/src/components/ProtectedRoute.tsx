import { Outlet } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Typography } from "@mui/material";
import { useEffect } from "react";

function ProtectedRoute () {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            loginWithRedirect();
        }
    }, [isLoading, isAuthenticated, loginWithRedirect]);

    // If the user is not authenticated, redirect to the login page
    if (isLoading || !isAuthenticated) {
        return <Typography sx={{ pt: 14 }}>Loading...</Typography>
    }

    return <Outlet />;
}

export default ProtectedRoute;