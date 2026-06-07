import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} from "./orders.controller";
import { requireAuth, syncUser } from "../../middleware/auth";

const router = Router();

router.use(requireAuth, syncUser);

router.get("/", getMyOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);
router.put("/:id/cancel", cancelOrder);

export default router;
