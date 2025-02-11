import { Router } from "express";
import { deleteFileAndMetadata, getFileDetails, getShowcaseImages, getUserFiles, uploadFile, uploadMiddleware } from "../controllers/fileController";
import { authenticatedUser, checkFileUploadPermissions } from "../middleware/authMiddleware";
import { requiredScopes } from "express-oauth2-jwt-bearer";

const router = Router();

router.post("/upload", authenticatedUser, checkFileUploadPermissions, uploadMiddleware, uploadFile);
router.get("/user/:user_id", requiredScopes("read:files"), getUserFiles);
router.get("/:id", getFileDetails);
router.get("/:id/showcase", getShowcaseImages);
router.delete("/:id", authenticatedUser, deleteFileAndMetadata);

export default router;