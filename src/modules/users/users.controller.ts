import { Request, Response } from "express";
import { prisma } from "../../config/db";

export const getMe = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, data: req.user });
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const { name, phone } = req.body;

  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: { name, phone },
  });

  res.json({ success: true, data: updated });
};
