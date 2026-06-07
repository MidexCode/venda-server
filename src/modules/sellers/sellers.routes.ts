import { Router } from "express";
import {
  becomeSeller,
  getSellerBySlug,
  getMyDashboard,
  getMyOrders,
} from "./sellers.controller";
import { protect, syncUser } from "../../middleware/auth";

const router = Router();

router.get("/:slug", getSellerBySlug);
router.post("/", protect, syncUser, becomeSeller);
router.get("/me/dashboard", protect, syncUser, getMyDashboard);
router.get("/me/orders", protect, syncUser, getMyOrders);

export default router;
