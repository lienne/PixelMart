import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import { addReview, getReviewsForListing } from "../controllers/reviewsController";

const router = Router();

router.post("/reviews", authenticatedUser, addReview);
router.get("/items/:itemId/reviews", getReviewsForListing);

export default router;