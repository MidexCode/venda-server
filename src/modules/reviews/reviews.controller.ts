import { Request, Response } from "express";
import * as ReviewService from "./reviews.service";

export const getProductReviews = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { page, limit } = req.query;
  const result = await ReviewService.getProductReviews(
    req.params.productId as string,
    page ? Number(page) : 1,
    limit ? Number(limit) : 10,
  );
  res.json({ success: true, ...result });
};

export const createReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const review = await ReviewService.createReview(req.user!.id, req.body);
  res.status(201).json({ success: true, data: review });
};

export const replyToReview = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const review = await ReviewService.replyToReview(
    req.params.id as string,
    req.user!.id,
    req.body.reply,
  );
  res.json({ success: true, data: review });
};
