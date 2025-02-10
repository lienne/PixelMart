import { Router } from "express";
import { deleteFileAndMetadata, getFileDetails, getShowcaseImages, getUserFiles, uploadFile, uploadShowcaseImage } from "../controllers/fileController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/upload", authenticatedUser, uploadFile);
router.post("/upload-showcase", authenticatedUser, uploadShowcaseImage);
router.get("/user/:user_id", getUserFiles);
router.get("/:id", getFileDetails);
router.get("/:id/showcase", getShowcaseImages);
router.delete("/:id", authenticatedUser, deleteFileAndMetadata);

export default router;