import { prisma } from "../../config/db";

export const getCart = async (userId: string) => {
  const items = await prisma.cartItem.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          comparePrice: true,
          images: true,
          stock: true,
          seller: { select: { storeName: true, storeSlug: true } },
        },
      },
    },
  });

  const total = items.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  return { items, total };
};

export const addToCart = async (
  userId: string,
  data: { productId: string; variantId?: string; quantity: number },
) => {
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) throw new Error("Product not found");
  if (product.stock < data.quantity) throw new Error("Not enough stock");

  const existing = await prisma.cartItem.findFirst({
    where: {
      userId,
      productId: data.productId,
      variantId: data.variantId ?? null,
    },
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + data.quantity },
    });
  }

  return prisma.cartItem.create({
    data: {
      userId,
      productId: data.productId,
      variantId: data.variantId,
      quantity: data.quantity,
    },
  });
};

export const updateCartItem = async (
  id: string,
  userId: string,
  quantity: number,
) => {
  return prisma.cartItem.update({
    where: { id, userId },
    data: { quantity },
  });
};

export const removeCartItem = async (id: string, userId: string) => {
  return prisma.cartItem.delete({
    where: { id, userId },
  });
};

export const clearCart = async (userId: string) => {
  return prisma.cartItem.deleteMany({
    where: { userId },
  });
};
