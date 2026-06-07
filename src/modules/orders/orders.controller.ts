import { Request, Response } from "express";
import * as OrderService from "./orders.service";

export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const order = await OrderService.createOrder(req.user!.id, req.body);
  res.status(201).json({ success: true, data: order });
};

export const getMyOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const orders = await OrderService.getMyOrders(req.user!.id);
  res.json({ success: true, data: orders });
};

export const getOrderById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const order = await OrderService.getOrderById(
    req.params.id as string,
    req.user!.id,
  );

  if (!order) {
    res.status(404).json({ success: false, message: "Order not found" });
    return;
  }

  res.json({ success: true, data: order });
};

export const cancelOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const order = await OrderService.cancelOrder(
    req.params.id as string,
    req.user!.id,
  );
  res.json({ success: true, data: order });
};
