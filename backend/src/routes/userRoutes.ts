import { Router } from "express";
import { syncUser, getUserProfile, updateUserProfile, checkUsernameAvailability, deleteUser, reactivateUser } from "../controllers/userController";
import { authenticatedUser } from "../middleware/authMiddleware";

const router = Router();

router.post('/sync', authenticatedUser, syncUser);
router.get('/profile/:identifier', getUserProfile);
router.put('/profile/:auth0Id', authenticatedUser, updateUserProfile);
router.get('/username-availability/:username', authenticatedUser, checkUsernameAvailability);
router.delete("/delete/:auth0Id", authenticatedUser, deleteUser); // Soft delete user
router.put("/reactivate/:auth0Id", authenticatedUser, reactivateUser);

export default router;