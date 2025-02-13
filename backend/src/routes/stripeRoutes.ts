import { Router } from "express";
import { stripeOauthCallback } from "../controllers/stripeController";

const router = Router();

router.get("/oauth/callback", stripeOauthCallback);

export default router;