import { Router } from "express";
import { syncUser, getUserProfile, updateUserProfile, checkUsernameAvailability, deleteUser, reactivateUser } from "../controllers/userController";

const router = Router();

router.post('/sync', syncUser);
router.get('/profile/:identifier', getUserProfile);
router.put('/profile/:auth0Id', updateUserProfile);
router.get('/username-availability/:username', checkUsernameAvailability);
router.delete("/delete/:auth0Id", deleteUser); // Soft delete user
router.put("/reactivate/:auth0Id", reactivateUser);

export default router;