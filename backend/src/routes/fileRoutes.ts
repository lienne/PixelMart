import { Router } from "express";
import {
    deleteFileAndMetadata,
    getFileDetails,
    getPublicUserFiles,
    getPopularItemsController,
    getShowcaseImages,
    getUserFiles,
    uploadFile,
    uploadMiddleware,
    getUserFileUsage,
    editFileDetails
} from "../controllers/fileController";
import { authenticatedUser, checkFileUploadPermissions } from "../middleware/authMiddleware";
import { requiredScopes } from "express-oauth2-jwt-bearer";
import rateLimit from "express-rate-limit";

const router = Router();
const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Max 10 uploads per 15 minutes per IP
    message: { message: "Too many uploads from this IP, please try again later." },
});

router.post("/upload", authenticatedUser, checkFileUploadPermissions, uploadLimiter, uploadMiddleware, uploadFile);
router.get("/user/:user_id", authenticatedUser, requiredScopes("read:files"), getUserFiles);
router.get("/public/user/:identifier", getPublicUserFiles); // Public endpoint for user profiles
router.get("/:id", getFileDetails);
router.get("/:id/showcase", getShowcaseImages);
router.delete("/:id", authenticatedUser, deleteFileAndMetadata);
router.get("/public/popular", getPopularItemsController);
router.get("/user/:user_id/usage", authenticatedUser, getUserFileUsage);
router.put("/edit-item/:id", authenticatedUser, editFileDetails);

export default router;