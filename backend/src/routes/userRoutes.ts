import { Router } from "express";
import { syncUser, getUserProfile, updateUserProfile, checkUsernameAvailability } from "../controllers/userController";

const router = Router();

router.post('/sync', syncUser);
router.get('/profile/:identifier', getUserProfile);
router.put('/profile/:auth0Id', updateUserProfile);
router.get('/username-availability/:username', checkUsernameAvailability);

export default router;