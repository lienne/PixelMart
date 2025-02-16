import { Router } from "express";
import { contactUs } from "../controllers/contactController";
import rateLimit from "express-rate-limit";

const router = Router();
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15min
    max: 2,
    message: { error: "Too many messages sent. Please try again later." }
});

router.post("/contact", contactLimiter, contactUs);

export default router;