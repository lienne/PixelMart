import { Request, Response } from "express";
import { searchListingsBySeller, searchListingsGlobal } from "../models/searchModel";

// Global search API
export const searchListings = async (req: Request, res: Response) => {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
        res.status(400).json({ message: "Query parameter is required." });
        return;
    }

    try {
        const listings = await searchListingsGlobal(query);
        res.status(200).json({ listings });
    } catch (err) {
        console.error("Error searching listings: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}

// Seller specific search API
export const searchSellerListings = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { query } = req.query;

    if (!query || typeof query !== "string") {
        res.status(400).json({ message: "Query parameter is required." });
        return;
    }

    try {
        const listings = await searchListingsBySeller(userId, query);
        res.status(200).json({ listings });
    } catch (err) {
        console.error("Error searching seller listings: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
}