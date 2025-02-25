import { Request, Response } from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import { getOrderBySessionId, getOrderDetailsById, getOrdersByUserId, hasUserPurchasedItem } from "../models/orderModel";
import { generatePresignedUrl } from "../services/s3Service";
import { getUserIdByAuth0Id } from "../models/userModel";
import { getFileDetailsById } from "../models/fileModel";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
});

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
    const includeDownloadLinks = req.query.includeDownloadLinks === "true"; // Check if frontend requests download links

    try {
        const order = await getOrderBySessionId(sessionId);
        if (!order) {
            res.status(404).json({ message: "Order not found." });
            return;
        }

        let itemsWithDownloadLinks = order.items;
        const items = order.items ?? [];
        
        if (includeDownloadLinks) {
            // Generate pre-signed URLs
            itemsWithDownloadLinks = await Promise.all(
                items.map(async (item) => ({
                    ...item,
                    downloadLink: await generatePresignedUrl(item.file_key),
                }))
            );
        }

        res.status(200).json({ ...order, items: itemsWithDownloadLinks });
    } catch(err: any) {
        console.error("Error fetching order by session id: ", err);
        res.status(500).json({ message: err.message });
    }
}

export const getUserOrders = async (req: Request, res: Response) => {
    const { user_id: auth0_id } = req.params;

    try {
        const user = await getUserIdByAuth0Id(auth0_id);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        let orders = await getOrdersByUserId(user.id);

        res.status(200).json({ orders });
    } catch (err) {
        console.error("Error fetching user orders: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const generateDownloadLink = async (req: Request, res: Response) => {
    const { fileId } = req.params;

    try {
        const fileDetails = await getFileDetailsById(fileId);
        if (!fileDetails) {
            res.status(404).json({ message: "File not found." });
            return;
        }

        const downloadLink = await generatePresignedUrl(fileDetails.file_key);
        res.status(200).json({ downloadLink });
    } catch (err) {
        console.error("Error generating presigned URL: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

export const checkUserPurchase = async (req: Request, res: Response) => {
    const { auth0Id, fileId } = req.params;

    try {
        const decodedAuth0Id = decodeURIComponent(auth0Id);
        const user = await getUserIdByAuth0Id(decodedAuth0Id);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        const userId = user.id;

        const hasPurchased = await hasUserPurchasedItem(userId, fileId);
        res.status(200).json({ hasPurchased });
    } catch (err) {
        console.error("Error checking purchase status: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}