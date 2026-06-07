import { Router } from "express";
import { aiSearch, getRecommendations, chatAssistant } from "./ai.controller";
import { requireAuth, syncUser } from "../../middleware/auth";

const router = Router();

router.post("/search", aiSearch);
router.get("/recommendations", requireAuth, syncUser, getRecommendations);
router.post("/assistant", requireAuth, syncUser, chatAssistant);

export default router;
