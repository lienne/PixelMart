import { useStripe } from "@stripe/react-stripe-js";
import { Button } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

function CheckoutButton ({ cartItems }: { cartItems: any[] }) {
    const stripe = useStripe();
    const { user, getAccessTokenSilently } = useAuth0();

    const handleCheckout = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/checkout/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ auth0Id: user?.sub, cartItems }),
            });

            const session = await response.json();

            if (!response.ok) {
                throw new Error(session.message || "Failed to create checkout session.");
            }

            if (stripe && session.sessionId) {
                // Redirect to the Stripe hosted checkout page
                const result = await stripe.redirectToCheckout({
                    sessionId: session.sessionId,
                });

                if (result.error) {
                    console.error("Stripe checkout error: ", result.error.message);
                }
            }
        } catch (err) {
            console.error("Error during checkout: ", err);
        }
    };

    return (
        <Button variant="contained" color="primary" onClick={handleCheckout}>
            Checkout
        </Button>
    );
}

export default CheckoutButton;