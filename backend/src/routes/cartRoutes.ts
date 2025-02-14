import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import { addItemToCart, getUserCart, removeItemFromCart } from "../controllers/cartController";

const router = Router();

router.get('/:userId/cart', authenticatedUser, getUserCart);
router.post('/:userId/cart', authenticatedUser, addItemToCart);
router.delete('/:userId/cart/:itemId', authenticatedUser, removeItemFromCart);

export default router;