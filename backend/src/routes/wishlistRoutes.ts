import { Router } from "express";
import { authenticatedUser } from "../middleware/authMiddleware";
import { addItemToWishlist, getUserWishlist, removeItemFromWishlist } from "../controllers/wishlistController";

const router = Router();

router.get('/:userId/wishlist', authenticatedUser, getUserWishlist);
router.post('/:userId/wishlist', authenticatedUser, addItemToWishlist);
router.delete('/:userId/wishlist/:itemId', authenticatedUser, removeItemFromWishlist);

export default router;