import { Request, Response, NextFunction } from "express";
import { clerkClient, clerkMiddleware, getAuth } from "@clerk/express";
import { prisma } from "../config/db";

export const protect = clerkMiddleware();

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  next();
};

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
