import { prisma } from "../../config/db";

export const createOrder = async (
  userId: string,
  data: {
    addressId: string;
    notes?: string;
  },
) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) throw new Error("Cart is empty");

  const subtotal = cartItems.reduce((sum, item) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const deliveryFee = 1500;
  const total = subtotal + deliveryFee;

  const order = await prisma.order.create({
    data: {
      userId,
      addressId: data.addressId,
      subtotal,
      deliveryFee,
      total,
      notes: data.notes,
      items: {
        create: cartItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
          unitPrice: item.product.price,
          totalPrice: Number(item.product.price) * item.quantity,
        })),
      },
      trackingEvents: {
        create: {
          status: "PENDING",
          message: "Your order has been placed successfully",
          location: "Venda Warehouse",
        },
      },
    },
    include: {
      items: { include: { product: true } },
      address: true,
      trackingEvents: true,
    },
  });

  await prisma.cartItem.deleteMany({ where: { userId } });

  return order;
};

export const getMyOrders = async (userId: string) => {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
              slug: true,
            },
          },
        },
      },
      payment: true,
      trackingEvents: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getOrderById = async (id: string, userId: string) => {
  return prisma.order.findFirst({
    where: { id, userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              images: true,
              slug: true,
              seller: { select: { storeName: true } },
            },
          },
        },
      },
      address: true,
      payment: true,
      trackingEvents: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
};

export const cancelOrder = async (id: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: { id, userId },
  });

  if (!order) throw new Error("Order not found");

  if (!["PENDING", "CONFIRMED"].includes(order.status)) {
    throw new Error("Order cannot be cancelled at this stage");
  }

  return prisma.order.update({
    where: { id },
    data: {
      status: "CANCELLED",
      trackingEvents: {
        create: {
          status: "CANCELLED",
          message: "Order cancelled by customer",
        },
      },
    },
  });
};
