import { Router } from "express";
import {
  getAllProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
} from "./products.controller";
import { protect, syncUser } from "../../middleware/auth";

const router = Router();

// Public routes — no auth needed
router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/:slug", getProductBySlug);

// Protected routes — seller only
router.post("/", protect, syncUser, createProduct);
router.put("/:id", protect, syncUser, updateProduct);
router.delete("/:id", protect, syncUser, deleteProduct);

export default router;
