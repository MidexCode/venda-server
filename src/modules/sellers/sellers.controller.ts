import { Request, Response } from "express";
import * as SellerService from "./sellers.service";

export const becomeSeller = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const existing = await import("../../config/db").then(({ prisma }) =>
    prisma.seller.findUnique({ where: { userId: req.user!.id } }),
  );

  if (existing) {
    res.status(400).json({ success: false, message: "Already a seller" });
    return;
  }

  const seller = await SellerService.becomeSeller(req.user!.id, req.body);
  res.status(201).json({ success: true, data: seller });
};

export const getSellerBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const seller = await SellerService.getSellerBySlug(req.params.slug as string);

  if (!seller) {
    res.status(404).json({ success: false, message: "Seller not found" });
    return;
  }

  res.json({ success: true, data: seller });
};

export const getMyDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const dashboard = await SellerService.getMyDashboard(req.user!.id);

  if (!dashboard) {
    res
      .status(404)
      .json({ success: false, message: "Seller profile not found" });
    return;
  }

  res.json({ success: true, data: dashboard });
};

export const getMyOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const orders = await SellerService.getMyOrders(req.user!.id);
  res.json({ success: true, data: orders });
};
