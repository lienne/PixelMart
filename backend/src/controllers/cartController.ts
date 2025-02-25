import { Request, Response } from "express";
import { addCartItemByUserId, deleteCartItemByUserId, getCartItemsByUserId } from "../models/cartModel";
import { getFileOwnerByFileId } from "../models/fileModel";

export const getUserCart = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const cartItems = await getCartItemsByUserId(userId);
        res.status(200).json({ cartItems });
    } catch (err) {
        console.error("Error retrieving cart items:", err);
        res.status(500).json({ message: "Internal server error. Failed to retrieve cart items." });
    }
};

export const addItemToCart = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        const { fileId } = req.body;
        if (!fileId) {
            res.status(400).json({ message: "fileId is required" });
            return;
        }

        // Check if the item belongs to the logged-in user
        const owner = await getFileOwnerByFileId(fileId);
        if (owner?.user_id === userId) {
            res.status(403).json({ message: "You cannot purchase your own item." });
            return;
        }

        const newCartItem = await addCartItemByUserId(userId, fileId);
        res.status(201).json({ newCartItem });
    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(500).json({ message: "Internal server error. Failed to add item to cart." });
    }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
    const { userId, itemId } = req.params;

    try {
        await deleteCartItemByUserId(userId, itemId);
        res.status(204).end();
    } catch (err) {
        console.error("Error removing item from cart:", err);
        res.status(500).json({ message: "Internal server error. Failed to remove item from cart." });
    }
};