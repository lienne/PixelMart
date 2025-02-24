import { Router } from "express";
import { checkUserPurchase, finalizeOrder, generateDownloadLink, getOrderBySession, getOrderDetails, getUserOrders } from "../controllers/orderController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = Router();

router.post("/finalize", authenticatedUser, finalizeOrder);
router.get("/:orderId", authenticatedUser, getOrderDetails);
router.get("/session/:sessionId", authenticatedUser, getOrderBySession);
router.get("/user/:user_id", authenticatedUser, getUserOrders);
router.get("/:orderId/download/:fileId", authenticatedUser, generateDownloadLink);
router.get("/:auth0Id/has-purchased/:fileId", authenticatedUser, checkUserPurchase);

export default router;