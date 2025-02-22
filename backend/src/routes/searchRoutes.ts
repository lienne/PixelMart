import { Router } from "express";
import { searchListings, searchSellerListings } from "../controllers/searchController";

const router = Router();

router.get("/search", searchListings);
router.get("/users/:userId/search", searchSellerListings);

export default router;