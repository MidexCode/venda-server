import { Request, Response } from "express";
import * as PaymentService from "./payments.service";
import crypto from "crypto";

export const initializePayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { orderId } = req.body;
  const result = await PaymentService.initializePayment(orderId, req.user!.id);
  res.json({ success: true, data: result });
};

export const verifyPayment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { reference } = req.params;
  const payment = await PaymentService.verifyPayment(reference as string);
  res.json({ success: true, data: payment });
};

export const handleWebhook = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const secret = process.env.PAYSTACK_SECRET_KEY!;
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    res.status(401).json({ success: false, message: "Invalid signature" });
    return;
  }

  await PaymentService.handleWebhook(req.body);
  res.sendStatus(200);
};
