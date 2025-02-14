import { Request, Response } from "express";
import { addCartItem, deleteCartItem, getCartItemsByUserId } from "../models/cartModel";
import { findUserByAuth0Id } from "../models/userModel";

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
    console.log("addItemToCart hit", req.params, req.body);
    try {
        const auth0Id = req.auth?.payload?.sub;
        if (!auth0Id) {
            res.status(401).json({ message: "Unauthorized: auth0Id is missing. "});
            return;
        }

        const user = await findUserByAuth0Id(auth0Id);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        const { fileId } = req.body;
        if (!fileId) {
            res.status(400).json({ message: "fileId is required" });
            return;
        }

        const newCartItem = await addCartItem(user.id, fileId);
        res.status(201).json({ newCartItem });
    } catch (err) {
        console.error("Error adding item to cart:", err);
        res.status(500).json({ message: "Internal server error. Failed to add item to cart." });
    }
};

export const removeItemFromCart = async (req: Request, res: Response) => {
    const { userId, itemId } = req.params;

    try {
        await deleteCartItem(userId, itemId);
        res.status(204).end();
    } catch (err) {
        console.error("Error removing item from cart:", err);
        res.status(500).json({ message: "Internal server error. Failed to remove item from cart." });
    }
};