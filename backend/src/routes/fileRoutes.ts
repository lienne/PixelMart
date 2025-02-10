import { Router } from "express";
import { deleteFileAndMetadata, getFileDetails, getShowcaseImages, getUserFiles, uploadFile, uploadFileToS3Controller, uploadMiddleware, uploadShowcaseImage } from "../controllers/fileController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/upload", uploadMiddleware, uploadFileToS3Controller);
router.post("/upload", authenticatedUser, uploadFile);
router.post("/upload-showcase", authenticatedUser, uploadShowcaseImage);
router.get("/user/:user_id", getUserFiles);
router.get("/:id", getFileDetails);
router.get("/:id/showcase", getShowcaseImages);
router.delete("/:id", authenticatedUser, deleteFileAndMetadata);

export default router;