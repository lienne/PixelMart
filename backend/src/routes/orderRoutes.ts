import { Router } from "express";
import { finalizeOrder, getOrderBySession, getOrderDetails } from "../controllers/orderController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/finalize", authenticatedUser, finalizeOrder);
router.get("/:orderId", authenticatedUser, getOrderDetails);
router.get("/session/:sessionId", authenticatedUser, getOrderBySession);

export default router;