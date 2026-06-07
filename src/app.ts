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

export default app;
