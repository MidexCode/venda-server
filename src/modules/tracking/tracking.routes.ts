import { Router } from "express";
import { getTrackingEvents } from "./tracking.controller";
import { requireAuth, syncUser } from "../../middleware/auth";

const router = Router();

router.get("/:orderId", requireAuth, syncUser, getTrackingEvents);

export default router;
