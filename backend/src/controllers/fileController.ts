import { Request, Response } from "express";
import {
    insertFileMetadata,
    insertFileDetails,
    insertShowcaseImage,
    getUserFilesByUserId,
    getFileMetadataById,
    getFileDetailsById,
    getShowcaseImagesByFileId,
    deleteFile
} from "../models/fileModel";

export const uploadFile = async (req: Request, res: Response) => {
    const { user_id, file_url, file_type, file_size, title, description, price, currency, is_public, category } = req.body;

    if (!user_id || !file_url || !file_type || !file_size || !title) {
        res.status(400).json({ message: "Missing required fields." });
        return;
    }

    try {
        // Store file metadata first
        const fileMetadata = await insertFileMetadata(user_id, file_url, file_type, file_size);

        // Store file details linked to the metadata ID
        const fileDetails = await insertFileDetails(fileMetadata.id, user_id, title, description, price, currency, is_public, category);

        res.status(201).json({ fileMetadata, fileDetails });
    } catch (err) {
        console.error("Error uploading file:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const uploadShowcaseImage = async (req: Request, res: Response) => {
    const { file_id, image_url } = req.body;

    if (!file_id || !image_url) {
        res.status(400).json({ message: "Missing required fields." });
        return;
    }

    try {
        const showcaseImage = await insertShowcaseImage(file_id, image_url);
        res.status(201).json({ showcaseImage });
    } catch (err) {
        console.error("Error uploading showcase image:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getUserFiles = async (req: Request, res: Response) => {
    const { user_id } = req.params;

    try {
        const files = await getUserFilesByUserId(user_id);
        res.status(200).json({ files });
    } catch (err) {
        console.error("Error fetching user's files:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getFileDetails = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const fileDetails = await getFileDetailsById(id);

        if (!fileDetails) {
            res.status(404).json({ message: "File not found." });
            return;
        }

        res.status(200).json(fileDetails);
    } catch (err) {
        console.error("Error fetching file details:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const getShowcaseImages = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const images = await getShowcaseImagesByFileId(id);
        res.status(200).json(images);
    } catch (err) {
        console.error("Error fetching showcase images:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const deleteFileAndMetadata = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const deleted = await deleteFile(id);

        if (!deleted) {
            res.status(404).json({ message: "File not found." });
            return;
        }

        res.status(200).json({ message: "File deleted successfully." });
    } catch (err) {
        console.error("Error deleting file:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};