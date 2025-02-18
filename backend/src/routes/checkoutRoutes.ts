import { Router } from "express";
import { createCheckoutSession, getCheckoutSession } from "../controllers/checkoutController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/create-checkout-session", authenticatedUser, createCheckoutSession);
router.get("/session", authenticatedUser, getCheckoutSession);

export default router;