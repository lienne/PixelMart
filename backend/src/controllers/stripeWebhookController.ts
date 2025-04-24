import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createOrder, createOrderItem } from "../models/orderModel";
import { CartItem, deleteCartItemByUserId, getCheckoutCart } from "../models/cartModel";
import { markUserAsSellerByStripeId } from "../models/userModel";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
});

// This endpoint should receive the raw body
export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {

    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig as string,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: any) {
        console.error(`Webhook signature verification failed: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle Connect account updates
    if (event.type === "account.updated") {
        const acct = event.data.object as Stripe.Account;

        // Only when the account is fully able to charge (onboarding completed)
        if (acct.details_submitted && acct.charges_enabled) {
            try {
                await markUserAsSellerByStripeId(acct.id);
                console.log(`Marked user with Stripe ID ${acct.id} as a seller.`);
            } catch (err: any) {
                console.error("Failed to mark seller status: ", err);
            }
        }

        res.status(200).json({ received: true });
        return;
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Retrieve the authenticated user ID from client_reference_id
        const userId = session.client_reference_id;
        if (!userId) {
            console.error("Missing user ID in session.");
            res.status(400).end();
            return;
        }

        const cartId = session.metadata?.cartId;
        if (!cartId) {
            console.error("Missing cartId in session metadata.");
            res.status(400).end();
            return;
        }

        let cartItems: CartItem[] = [];
        try {
            cartItems = await getCheckoutCart(cartId);
            console.log("cart items from checkout cart: ", cartItems);
        } catch (err) {
            console.error("Error fetching checkout cart: ", err);
            res.status(400).end();
            return;
        }

        // Calculate total amount from cart items
        const totalAmount = cartItems.reduce(
            (sum: number, item: any) => sum + Number(item.price) * (item.quantity || 1),
            0
        );

        try {
            // Create the order record
            const order = await createOrder(userId, session.id, totalAmount, "paid");
            console.log("Order created with ID: ", order.id);

            // Insert order items
            for (const item of cartItems) {
                await createOrderItem(
                    order.id,
                    item.file_id,
                    item.file_key,
                    item.title,
                    item.price,
                    item.seller_id
                );

                // Remove purchased items from the cart
                await deleteCartItemByUserId(userId, item.file_id);
                console.log(`Removed ${item.file_id} from cart for user: ${userId}`);
            }
            console.log("Order finalized: ", order.id);
        } catch (err) {
            console.error("Error finalizing order in webhook: ", err);
        }
    }

    // Acknowledge receipt of the event
    res.status(200).json({ received: true });
}