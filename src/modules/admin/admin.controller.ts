import { Request, Response } from "express";
import { prisma } from "../../config/db";

export const getDashboard = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalSellers,
    recentOrders,
    revenue,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.seller.count(),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        items: true,
      },
    }),
    prisma.payment.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
    }),
  ]);

  res.json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalSellers,
        totalRevenue: revenue._sum.amount ?? 0,
      },
      recentOrders,
    },
  });
};

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: { seller: true },
    }),
    prisma.user.count(),
  ]);

  res.json({
    success: true,
    data: users,
    pagination: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { page = 1, limit = 20 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        seller: { select: { storeName: true } },
        category: { select: { name: true } },
      },
    }),
    prisma.product.count(),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

export const featureProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const product = await prisma.product.update({
    where: { id: req.params.id as string },
    data: { isFeatured: req.body.isFeatured },
  });
  res.json({ success: true, data: product });
};

export const suspendUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const user = await prisma.user.update({
    where: { id: req.params.id as string },
    data: { role: "BUYER" },
  });
  res.json({ success: true, data: user });
};
