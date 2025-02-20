import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { createOrder, createOrderItem, getOrderBySessionId, getOrderDetailsById } from "../models/orderModel";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
});

export const finalizeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const { session_id, cartItems } = req.body;
        if (!session_id || !cartItems) {
            res.status(400).json({ message: "Missing session id or cart items." });
            return;
        }

        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);
        const userId = session.client_reference_id;
        if (!userId) {
            res.status(400).json({ message: "Missing user identifier in session." });
            return;
        }

        // Calculate total amount
        const totalAmount = cartItems.reduce(
            (sum: number, item: any) => sum + Number(item.price) * (item.quantity || 1),
            0
        );

        // Create order record
        const order = await createOrder(userId, session.id, totalAmount, "paid");

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
        }

        // res.status(200).json({ order });
        res.redirect(`${process.env.FRONTEND_URL}/checkout-success?order_id=${order.id}`);
    } catch (err: any) {
        console.error("Error finalizing order: ", err);
        res.status(500).json({ message: err.message });
    }
}

export const getOrderDetails = async (req: Request, res: Response): Promise<void> => {
    const { orderId } = req.params;

    try {
        const order = await getOrderDetailsById(orderId);
        res.status(200).json(order);
    } catch (err: any) {
        console.error("Error fetching order details: ", err);
        res.status(500).json({ message: err.message });
    }
}

export const getOrderBySession = async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;

    try {
        const order = await getOrderBySessionId(sessionId);
        res.status(200).json(order);
    } catch(err: any) {
        console.error("Error fetching order by session id: ", err);
        res.status(500).json({ message: err.message });
    }
}