import { prisma } from "../../config/db";
import { OrderStatus } from "@prisma/client";

export const getTrackingEvents = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: {
      trackingEvents: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) throw new Error("Order not found");
  return order;
};

export const advanceOrderStatus = async () => {
  const statusFlow: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
  ];

  const messages: Record<string, string> = {
    CONFIRMED: "Payment confirmed. Your order is being processed.",
    PROCESSING: "Your order is being packaged at our warehouse.",
    SHIPPED: "Your order has been picked up by the courier.",
    OUT_FOR_DELIVERY: "Your order is out for delivery. Expect it today!",
    DELIVERED: "Your order has been delivered successfully. Enjoy!",
  };

  const locations: Record<string, string> = {
    CONFIRMED: "Venda Warehouse, Lagos",
    PROCESSING: "Venda Warehouse, Lagos",
    SHIPPED: "Lagos Mainland Hub",
    OUT_FOR_DELIVERY: "Near your location",
    DELIVERED: "Delivered",
  };

  const activeOrders = await prisma.order.findMany({
    where: {
      status: {
        notIn: ["DELIVERED", "CANCELLED", "REFUNDED"],
      },
    },
  });

  for (const order of activeOrders) {
    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) continue;

    const nextStatus = statusFlow[currentIndex + 1];

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
        trackingEvents: {
          create: {
            status: nextStatus,
            message: messages[nextStatus],
            location: locations[nextStatus],
          },
        },
      },
    });

    console.log(`Order ${order.id} advanced to ${nextStatus}`);
  }
};
