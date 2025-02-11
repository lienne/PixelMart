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
import { getUserIdByAuth0Id } from "../models/userModel";
import multer from "multer";
import { uploadFileToS3 } from "../services/s3Service";

const upload = multer({ storage: multer.memoryStorage() });

export const uploadFile = async (req: Request, res: Response) => {
    try {
        if (!req.files || typeof req.files !== "object" || !("file" in req.files)) {
            res.status(400).json({ message: "No file uploaded." });
            return;
        }

        const uploadedFile = (req.files["file"] as Express.Multer.File[])[0];

        if (!uploadedFile) {
            res.status(400).json({ message: "File not found in request." });
            return;
        }

        console.log("Received file:", uploadedFile.originalname);

        const { auth0_id, title, description, price, currency, is_public, category } = req.body;

        if (!auth0_id || !title || !price) {
            console.error("Missing required fields: ", { auth0_id, title, price });
            res.status(400).json({ message: "Missing required fields." });
            return;
        }

        const user = await getUserIdByAuth0Id(auth0_id);
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        const user_id = user.id;

        // Upload main file to S3 first
        const s3Result = await uploadFileToS3(uploadedFile.buffer, uploadedFile.originalname, uploadedFile.mimetype);
        const file_url = s3Result.Location;

        // Store file metadata
        const fileMetadata = await insertFileMetadata(user_id, file_url, uploadedFile.mimetype, uploadedFile.size);

        // Store file details linked to the metadata ID
        const fileDetails = await insertFileDetails(fileMetadata.id, user_id, title, description, price, currency, is_public, category);

        // Handle showcase images
        let showcaseImagesMetadata = [];

        if (req.files["showcase_images"]) {
            const showcaseImages = req.files["showcase_images"] as Express.Multer.File[];

            for (const image of showcaseImages) {
                // Upload showcase image to S3
                const s3ShowcaseResult = await uploadFileToS3(image.buffer, image.originalname, image.mimetype);
                const image_url = s3ShowcaseResult.Location;

                // Store showcase image metadata
                const showcaseImage = await insertShowcaseImage(fileMetadata.id, image_url);

                showcaseImagesMetadata.push(showcaseImage);
            }
        }

        res.status(201).json({ fileMetadata, fileDetails, showcaseImagesMetadata });
    } catch (err) {
        console.error("Error uploading file and/or showcase images: ", err);
        res.status(500).json({ message: "Internal server error." });
    }
};

export const uploadShowcaseImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No showcase image uploaded." });
            return;
        }

        const { file_id } = req.body;

        if (!file_id) {
            res.status(400).json({ message: "Missing file_id." });
            return;
        }

        // Upload image to S3
        const s3Result = await uploadFileToS3(req.file.buffer, req.file.originalname, req.file.mimetype);
        const image_url = s3Result.Location;

        console.log("S3 Showcase Image Url: ", image_url);

        // Store showcase images metadata
        const showcaseImage = await insertShowcaseImage(file_id, image_url);

        console.log("Inserted Showcase Image: ", showcaseImage);

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

// Export multer upload middleware
export const uploadMiddleware = upload.fields([
    { name: "file", maxCount: 1 }, // Single file
    { name: "showcase_images", maxCount: 5 } // Multiple showcase images
]);