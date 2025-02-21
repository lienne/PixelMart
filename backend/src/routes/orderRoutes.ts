import { Router } from "express";
import { finalizeOrder, getOrderBySession, getOrderDetails, getUserOrders } from "../controllers/orderController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/finalize", authenticatedUser, finalizeOrder);
router.get("/:orderId", authenticatedUser, getOrderDetails);
router.get("/session/:sessionId", authenticatedUser, getOrderBySession);
router.get("/user/:user_id", authenticatedUser, getUserOrders);

export default router;