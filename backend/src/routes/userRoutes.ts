import { Router } from "express";
import { syncUser, getPublicUserProfile, updateUserProfile, checkUsernameAvailability, deleteUser, reactivateUser, getPrivateUserProfile } from "../controllers/userController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = Router();

router.post('/sync', authenticatedUser, syncUser);
router.get('/public-profile/:identifier', getPublicUserProfile);
router.get('/profile/:identifier', authenticatedUser, getPrivateUserProfile);
router.put('/profile/:auth0Id', authenticatedUser, updateUserProfile);
router.get('/username-availability/:username', authenticatedUser, checkUsernameAvailability);
router.delete("/delete/:auth0Id", authenticatedUser, deleteUser); // Soft delete user
router.put("/reactivate/:auth0Id", authenticatedUser, reactivateUser);

export default router;