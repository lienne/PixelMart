import { Router } from "express";
import { stripeWebhook } from "../controllers/stripeWebhookController";

const router = Router();

router.post("/", stripeWebhook);

export default router;