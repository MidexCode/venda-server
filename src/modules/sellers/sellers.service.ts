import { prisma } from "../../config/db";

export const becomeSeller = async (
  userId: string,
  data: { storeName: string; description?: string },
) => {
  const storeSlug = data.storeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const seller = await prisma.seller.create({
    data: {
      userId,
      storeName: data.storeName,
      storeSlug,
      description: data.description,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { role: "SELLER" },
  });

  return seller;
};

export const getSellerBySlug = async (slug: string) => {
  return prisma.seller.findUnique({
    where: { storeSlug: slug },
    include: {
      products: {
        where: { isActive: true },
        take: 20,
        include: {
          category: { select: { name: true, slug: true } },
        },
      },
    },
  });
};

export const getMyDashboard = async (userId: string) => {
  const seller = await prisma.seller.findUnique({
    where: { userId },
    include: {
      products: { where: { isActive: true } },
    },
  });

  if (!seller) return null;

  const orders = await prisma.order.findMany({
    where: {
      items: { some: { product: { sellerId: seller.id } } },
    },
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const totalRevenue = await prisma.orderItem.aggregate({
    where: { product: { sellerId: seller.id } },
    _sum: { totalPrice: true },
  });

  return {
    seller,
    recentOrders: orders,
    totalRevenue: totalRevenue._sum.totalPrice ?? 0,
    totalProducts: seller.products.length,
  };
};

export const getMyOrders = async (userId: string) => {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) return [];

  return prisma.order.findMany({
    where: {
      items: { some: { product: { sellerId: seller.id } } },
    },
    include: {
      items: {
        include: { product: true },
      },
      user: { select: { name: true, email: true } },
      address: true,
    },
    orderBy: { createdAt: "desc" },
  });
};
