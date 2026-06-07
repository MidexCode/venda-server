import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import userRoutes from "./modules/users/users.routes";
import productRoutes from "./modules/products/products.routes";
import { errorHandler } from "./middleware/errorHandler";
import categoryRoutes from "./modules/categories/categories.routes";
import sellerRoutes from "./modules/sellers/sellers.routes";
import cartRoutes from "./modules/cart/cart.routes";
import orderRoutes from "./modules/orders/orders.routes";
import paymentRoutes from "./modules/payments/payments.routes";
import trackingRoutes from "./modules/tracking/tracking.routes";
import reviewRoutes from "./modules/reviews/reviews.routes";
import adminRoutes from "./modules/admin/admin.routes";
import aiRoutes from "./modules/ai/ai.routes.";

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "Venda server is running" });
});

app.use("/api/products", productRoutes);
app.use(errorHandler);
app.use("/api/categories", categoryRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoutes);

export default app;
