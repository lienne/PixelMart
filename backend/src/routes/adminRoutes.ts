import { Router } from "express";
import { dismissReport, getAllReports } from "../controllers/reportController";
import { banUserAccount } from "../controllers/userController";
import { authenticatedUser, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/reports", authenticatedUser, requireAdmin, getAllReports);
router.post("/ban", authenticatedUser, requireAdmin, banUserAccount);
router.put("/dismiss/:reportId", authenticatedUser, requireAdmin, dismissReport);

export default router;
