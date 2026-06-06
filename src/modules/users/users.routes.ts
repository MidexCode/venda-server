import { Router } from "express";
import { getMe, updateMe } from "./users.controller";
import { protect, syncUser } from "../../middleware/auth";

const router = Router();

router.get("/me", protect, syncUser, getMe);
router.put("/me", protect, syncUser, updateMe);

export default router;
