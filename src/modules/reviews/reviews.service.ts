import { prisma } from "../../config/db";

export const getProductReviews = async (
  productId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, avatarUrl: true } },
      },
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  return { reviews, total, page, totalPages: Math.ceil(total / limit) };
};

export const createReview = async (
  userId: string,
  data: {
    productId: string;
    rating: number;
    title?: string;
    body: string;
    images?: string[];
  },
) => {
  const purchasedOrder = await prisma.orderItem.findFirst({
    where: {
      productId: data.productId,
      order: { userId, status: "DELIVERED" },
    },
  });

  const review = await prisma.review.create({
    data: {
      userId,
      productId: data.productId,
      rating: data.rating,
      title: data.title,
      body: data.body,
      images: data.images ?? [],
      isVerified: !!purchasedOrder,
    },
  });

  const agg = await prisma.review.aggregate({
    where: { productId: data.productId },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.product.update({
    where: { id: data.productId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewCount: agg._count.rating,
    },
  });

  return review;
};

export const replyToReview = async (
  reviewId: string,
  userId: string,
  reply: string,
) => {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) throw new Error("Not a seller");

  return prisma.review.update({
    where: { id: reviewId },
    data: { sellerReply: reply },
  });
};
