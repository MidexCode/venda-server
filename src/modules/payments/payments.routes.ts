import { Router } from "express";
import {
  initializePayment,
  verifyPayment,
  handleWebhook,
} from "./payments.controller";
import { requireAuth, syncUser } from "../../middleware/auth";

const router = Router();

router.post("/webhook", handleWebhook);
router.post("/initialize", requireAuth, syncUser, initializePayment);
router.get("/verify/:reference", requireAuth, syncUser, verifyPayment);

export default router;
