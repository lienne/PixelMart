import { Router } from "express";
import { dismissReport, getAllReports, getDismissedReports, reactivateReport } from "../controllers/reportController";
import { banUserAccount } from "../controllers/userController";
import { authenticatedUser, requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/reports", authenticatedUser, requireAdmin, getAllReports);
router.post("/ban", authenticatedUser, requireAdmin, banUserAccount);
router.put("/dismiss/:reportId", authenticatedUser, requireAdmin, dismissReport);
router.get("/dismissed-reports", authenticatedUser, requireAdmin, getDismissedReports);
router.put("/reactivate/:reportId", authenticatedUser, requireAdmin, reactivateReport);

export default router;
