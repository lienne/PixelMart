import { Router } from "express";
import { syncUser, getPublicUserProfile, updateUserProfile, checkUsernameAvailability, deleteUser, reactivateUser, getPrivateUserProfile } from "../controllers/userController";
import { authenticatedUser } from "../middleware/authMiddleware";
import rateLimit from "express-rate-limit";

const profileUpdateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15min
    max: 3, // Max 3 profile updates per 15min
    message: { message: "Too many profile updates. Try again later." }
});

const router = Router();

router.post('/sync', authenticatedUser, syncUser);
router.get('/public-profile/:identifier', getPublicUserProfile);
router.get('/profile/:identifier', authenticatedUser, getPrivateUserProfile);
router.put('/profile/update/:auth0Id', authenticatedUser, profileUpdateLimiter, updateUserProfile);
router.get('/username-availability/:username', authenticatedUser, checkUsernameAvailability);
router.delete("/delete/:auth0Id", authenticatedUser, deleteUser); // Soft delete user
router.put("/reactivate/:auth0Id", authenticatedUser, reactivateUser);

export default router;