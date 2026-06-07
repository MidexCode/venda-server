import { Request, Response } from "express";
import * as CartService from "./cart.service";

export const getCart = async (req: Request, res: Response): Promise<void> => {
  const cart = await CartService.getCart(req.user!.id);
  res.json({ success: true, data: cart });
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const item = await CartService.addToCart(req.user!.id, req.body);
  res.status(201).json({ success: true, data: item });
};

export const updateCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400).json({ success: false, message: "Invalid quantity" });
    return;
  }

  const item = await CartService.updateCartItem(
    req.params.id as string,
    req.user!.id,
    quantity,
  );
  res.json({ success: true, data: item });
};

export const removeCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  await CartService.removeCartItem(req.params.id as string, req.user!.id);
  res.json({ success: true, message: "Item removed from cart" });
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  await CartService.clearCart(req.user!.id);
  res.json({ success: true, message: "Cart cleared" });
};
