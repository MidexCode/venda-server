import { Router } from "express";
import {
  getProductReviews,
  createReview,
  replyToReview,
} from "./reviews.controller";
import { requireAuth, syncUser } from "../../middleware/auth";

const router = Router();

router.get("/product/:productId", getProductReviews);
router.post("/", requireAuth, syncUser, createReview);
router.put("/:id/reply", requireAuth, syncUser, replyToReview);

export default router;
