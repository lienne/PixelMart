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
        if (!userRecord) {
            res.status(400).json({ message: "User not found." });
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
        
        res.status(200).json({ id: session.id });
    } catch (err: any) {
        console.error("Error creating Checkout Session: ", err);
        res.status(500).json({ error: err.message });
    }
};

// export const getCheckoutSession = async (req: Request, res: Response): Promise<void> => {
//     const { session_id } = req.query;
//     if (!session_id || typeof session_id !== "string") {
//         res.status(400).json({ message: "Missing session id." });
//         return;
//     }

//     try {
//         const session = await stripe.checkout.sessions.retrieve(session_id);
//         const clientReference = session.client_reference_id;
//         const authenticatedUserId = (req as any).auth?.payload?.sub;

//         if (!clientReference || clientReference !== authenticatedUserId) {
//             res.status(403).json({ message: "You are not authorized to access this session." });
//             return;
//         }

//         // Alternatively, retrieve order details from database based on session id (need to implement)
//         const orderDetails = {
//             items: [
//                 {
//                     id: 1,
//                     title: "Digital Product 1",
//                     downloadLink: "https://my-s3-bucket-url.com/private/digital-product-1.pdf",
//                 },
//                 // more items
//             ],
//         };

//         res.status(200).json(orderDetails);
//     } catch (err: any) {
//         console.error("Error retrieving checkout session: ", err);
//         res.status(500).json({ message: err.message });
//     }
// };