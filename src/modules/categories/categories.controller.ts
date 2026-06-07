import { Request, Response } from "express";
import * as CategoryService from "./categories.service";

export const getAllCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const categories = await CategoryService.getAllCategories();
  res.json({ success: true, data: categories });
};

export const createCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const category = await CategoryService.createCategory(req.body);
  res.status(201).json({ success: true, data: category });
};
