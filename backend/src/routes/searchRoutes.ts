import { NextFunction, Request, Response, Router } from "express";
import { searchListings, searchSellerListings } from "../controllers/searchController";
import rateLimit from "express-rate-limit";

const router = Router();

const searchRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1min window
    max: 10, // Limit each IP to 10 requests per minute
    message: { message: "Too many search requests. Please slow down." },
    headers: true,
});

const botBlocker = (req: Request, res: Response, next: NextFunction) => {
    const userAgent = req.headers["user-agent"];
    if (userAgent && /(bot|crawler|spider)/i.test(userAgent)) {
        res.status(403).json({ message: "Automated scrapers are not allowed." });
        return;
    }
    next();
}

router.get("/search", searchRateLimiter, botBlocker, searchListings);
router.get("/users/:userId/search", searchRateLimiter, botBlocker, searchSellerListings);

export default router;