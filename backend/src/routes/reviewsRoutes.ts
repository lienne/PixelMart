import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import { addReview, getItemRatings, getReviewsForListing } from "../controllers/reviewsController";

const router = Router();

router.post("/reviews", authenticatedUser, addReview);
router.get("/items/:itemId/reviews", getReviewsForListing);
router.get("/items/:itemId/ratings", getItemRatings);

export default router;