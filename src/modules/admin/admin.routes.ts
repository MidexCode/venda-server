import { Router } from "express";
import {
  getDashboard,
  getAllUsers,
  getAllProducts,
  featureProduct,
  suspendUser,
} from "./admin.controller";
import { requireAuth, syncUser } from "../../middleware/auth";

const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== "ADMIN") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access only" });
  }
  next();
};

const router = Router();

router.use(requireAuth, syncUser, requireAdmin);

router.get("/dashboard", getDashboard);
router.get("/users", getAllUsers);
router.get("/products", getAllProducts);
router.put("/products/:id/feature", featureProduct);
router.put("/users/:id/suspend", suspendUser);

export default router;
