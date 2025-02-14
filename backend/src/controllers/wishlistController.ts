import { Request, Response } from "express";
import { addWishlistItem, deleteWishlistItem, getWishlistItemsByUserId } from "../models/wishlistModel";

export const getUserWishlist = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const wishlistItems = await getWishlistItemsByUserId(userId);
        res.status(200).json({ wishlistItems });
    } catch (err) {
        console.error("Error retrieving wishlist items:", err);
        res.status(500).json({ message: "Internal server error. Failed to retrieve wishlist items." });
    }
};

export const addItemToWishlist = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { fileId } = req.body;

    if (!fileId) {
        res.status(400).json({ message: "fileId is required." });
    }

    try {
        const newWishlistItem = await addWishlistItem(userId, fileId);
        res.status(201).json({ newWishlistItem });
    } catch (err) {
        console.error("Error adding item to wishlist:", err);
        res.status(500).json({ message: "Internal server error. Failed to add item to wishlist." });
    }
};

export const removeItemFromWishlist = async (req: Request, res: Response) => {
    const { userId, itemId } = req.params;

    try {
        await deleteWishlistItem(userId, itemId);
        res.status(204).end();
    } catch (err) {
        console.error("Error removing item from wishlist:", err);
        res.status(500).json({ message: "Internal server error. Failed to remove item from wishlist." });
    }
};