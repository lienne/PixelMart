import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createCheckoutCart } from "../models/cartModel";
import { findUserByAuth0Id } from "../models/userModel";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
});

export const createCheckoutSession = async (req: Request, res: Response): Promise<void> => {
    try {
        const { cartItems, auth0Id } = req.body;

        if (!auth0Id || !cartItems) {
            res.status(400).json({ message: "Missing user id or cart items." });
            return;
        }

        const userRecord = await findUserByAuth0Id(auth0Id);
        if (!userRecord || userRecord.is_banned) {
            res.status(400).json({ message: "User not found or user is banned." });
            return;
        }
        const userId = userRecord.id;

        const cartId = await createCheckoutCart(userId, cartItems);

        const line_items = cartItems.map((item: any) => ({
            price_data: {
                currency: item.currency || "usd",
                product_data: {
                    name: item.title,
                    description: item.description,
                    images: item.images && item.images.length > 0 ? [item.images[0]] : [],
                },
                unit_amount: Math.round(Number(item.price) * 100), // Convert dollars to cents
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items,
            // Use client_reference_id to store authenticated user's ID
            client_reference_id: userId,
            success_url: `${process.env.FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/checkout-cancel`,
            metadata: {
                // Only include minimal data to keep the string short
                cartId,
            },
        });

        console.log("Client Reference ID:", session.client_reference_id);
        
        res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
        console.error("Error creating Checkout Session: ", err);
        res.status(500).json({ error: err.message });
    }
};