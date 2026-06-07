import { Request, Response } from "express";
import * as ProductService from "./products.service";

export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { page, limit, category, search, minPrice, maxPrice, sortBy } =
    req.query;

  const result = await ProductService.getAllProducts({
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 20,
    category: category as string,
    search: search as string,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sortBy: sortBy as string,
  });

  res.json({ success: true, ...result });
};

export const getProductBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const slug = req.params.slug as string;
  const product = await ProductService.getProductBySlug(slug);

  if (!product) {
    res.status(404).json({ success: false, message: "Product not found" });
    return;
  }

  res.json({ success: true, data: product });
};

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const seller = await import("../../config/db").then(({ prisma }) =>
    prisma.seller.findUnique({ where: { userId: req.user!.id } }),
  );

  if (!seller) {
    res.status(403).json({
      success: false,
      message: "You must be a seller to create products",
    });
    return;
  }

  const product = await ProductService.createProduct(seller.id, req.body);
  res.status(201).json({ success: true, data: product });
};

export const updateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const seller = await import("../../config/db").then(({ prisma }) =>
    prisma.seller.findUnique({ where: { userId: req.user!.id } }),
  );

  if (!seller) {
    res.status(403).json({ success: false, message: "Not a seller" });
    return;
  }

  const product = await ProductService.updateProduct(
    req.params.id as string,
    seller.id,
    req.body,
  );
  res.json({ success: true, data: product });
};

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const seller = await import("../../config/db").then(({ prisma }) =>
    prisma.seller.findUnique({ where: { userId: req.user!.id } }),
  );

  if (!seller) {
    res.status(403).json({ success: false, message: "Not a seller" });
    return;
  }

  await ProductService.deleteProduct(req.params.id as string, seller.id);
  res.json({ success: true, message: "Product deleted" });
};

export const getFeaturedProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const products = await ProductService.getFeaturedProducts();
  res.json({ success: true, data: products });
};
