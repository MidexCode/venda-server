import { prisma } from "../../config/db";

export const getAllProducts = async (query: {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
}) => {
  const {
    page = 1,
    limit = 20,
    category,
    search,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
  } = query;

  const skip = (page - 1) * limit;

  const where: any = {
    isActive: true,
    ...(category && { category: { slug: category } }),
    ...(search && {
      name: { contains: search, mode: "insensitive" },
    }),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice }),
          },
        }
      : {}),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [sortBy]: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        seller: { select: { storeName: true, storeSlug: true, rating: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      seller: {
        select: {
          storeName: true,
          storeSlug: true,
          logoUrl: true,
          rating: true,
          totalSales: true,
          isVerified: true,
        },
      },
      variants: true,
      reviews: {
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, avatarUrl: true } },
        },
      },
    },
  });

  return product;
};

export const createProduct = async (
  sellerId: string,
  data: {
    categoryId: string;
    name: string;
    description: string;
    price: number;
    comparePrice?: number;
    stock: number;
    images: string[];
    tags?: string[];
  },
) => {
  const slug =
    data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now();

  const product = await prisma.product.create({
    data: {
      ...data,
      slug,
      sellerId,
    },
  });

  return product;
};

export const updateProduct = async (
  id: string,
  sellerId: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    comparePrice: number;
    stock: number;
    images: string[];
    tags: string[];
    isActive: boolean;
  }>,
) => {
  const product = await prisma.product.update({
    where: { id, sellerId },
    data,
  });

  return product;
};

export const deleteProduct = async (id: string, sellerId: string) => {
  await prisma.product.update({
    where: { id, sellerId },
    data: { isActive: false },
  });
};

export const getFeaturedProducts = async () => {
  return prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    take: 10,
    include: {
      category: { select: { name: true, slug: true } },
      seller: { select: { storeName: true, storeSlug: true } },
    },
  });
};
