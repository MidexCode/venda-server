import { Request, Response, NextFunction } from "express";
import { clerkClient, requireAuth } from "@clerk/express";
import { prisma } from "../config/db";

export const protect = requireAuth();

export const syncUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.auth!;

    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0].emailAddress,
          name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
          avatarUrl: clerkUser.imageUrl,
        },
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
