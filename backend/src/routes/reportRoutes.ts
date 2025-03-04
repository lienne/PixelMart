import { Router } from "express";
import { reportUserOrListingOrReview } from "../controllers/reportController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/report", authenticatedUser, reportUserOrListingOrReview);

export default router;