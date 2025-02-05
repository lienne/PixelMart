import { Router } from "express";
import { syncUser, getUserProfile, updateUserProfile } from "../controllers/userController";

const router = Router();

router.post('/sync', syncUser);
router.get('/profile/:auth0Id', getUserProfile);
router.put('/profile/:auth0Id', updateUserProfile);

export default router;