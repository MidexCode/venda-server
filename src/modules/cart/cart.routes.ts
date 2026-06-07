import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "./cart.controller";
import { protect, syncUser } from "../../middleware/auth";

const router = Router();

router.use(protect, syncUser);

router.get("/", getCart);
router.post("/", addToCart);
router.put("/:id", updateCartItem);
router.delete("/clear", clearCart);
router.delete("/:id", removeCartItem);

export default router;
