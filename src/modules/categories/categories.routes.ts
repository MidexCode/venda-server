import { Router } from "express";
import { getAllCategories, createCategory } from "./categories.controller";
import { protect, syncUser } from "../../middleware/auth";

const router = Router();

router.get("/", getAllCategories);
router.post("/", protect, syncUser, createCategory);

export default router;
