import { Router } from "express";
import { reportUserOrListingOrReview } from "../controllers/reportController";
import { authenticatedUser } from "../middleware/authMiddleware";
import rateLimit from "express-rate-limit";

const reportLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10min
    max: 5, // Max 5 reports per user per 10 minutes
    message: { message: "Too many reports submitted. Try again later." }
});

const router = Router();

router.post("/report", authenticatedUser, reportLimiter, reportUserOrListingOrReview);

export default router;