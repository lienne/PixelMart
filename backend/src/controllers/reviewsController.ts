import { Request, Response } from "express";
import { checkIfUserBoughtItem, createReview, getReviewsByItemId } from "../models/reviewsModel";
import { findUserByAuth0Id } from "../models/userModel";

export const addReview = async (req: Request, res: Response) => {
    try {
        const auth0Id = req.auth?.payload.sub;
        if (!auth0Id) {
            return;
        }
        const user = await findUserByAuth0Id(auth0Id);
        if (!user?.id) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        const { itemId, rating, comment } = req.body;
        if (!itemId || !rating || !comment) {
            res.status(400).json({ message: "itemId, rating, and comment are required." });
            return;
        }

        const hasUserBoughtItem = await checkIfUserBoughtItem(user.id, itemId);

        if (!hasUserBoughtItem) {
            res.status(403).json({ message: "You cannot review an item you have not bought." });
            return;
        }

        const review = await createReview(itemId, user.id, rating, comment);
        res.status(200).json({ message: "Review added successfully.", review });
    } catch (err) {
        console.error("Error adding review: ", err);
        res.status(500).json({ message: "Internal server error. Failed to add review." });
    }
}

export const getReviewsForListing = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        if (!itemId) {
            res.status(400).json({ message: "itemId is required." });
            return;
        }

        const reviews = await getReviewsByItemId(itemId);
        res.status(200).json({ reviews });
    } catch (err) {
        console.error("Error fetching reviews: ", err);
        res.status(500).json({ message: "Internal server error. Failed to fetch reviews." });
    }
}