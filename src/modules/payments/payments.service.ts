import { prisma } from "../../config/db";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const PAYSTACK_BASE = "https://api.paystack.co";

export const initializePayment = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { user: true },
  });

  if (!order) throw new Error("Order not found");
  if (order.status !== "PENDING") throw new Error("Order already paid");

  const reference = `VENDA-${orderId}-${Date.now()}`;
  const amountInKobo = Math.round(Number(order.total) * 100);

  const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: order.user.email,
      amount: amountInKobo,
      reference,
      metadata: { orderId, userId },
    }),
  });

  const data = (await response.json()) as any;

  if (!data.status) throw new Error("Payment initialization failed");

  await prisma.payment.create({
    data: {
      orderId,
      paystackRef: reference,
      amount: order.total,
      status: "PENDING",
    },
  });

  return {
    authorizationUrl: data.data.authorization_url,
    reference,
  };
};

export const verifyPayment = async (reference: string) => {
  const response = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
    },
  );

  const data = (await response.json()) as any;

  if (!data.status || data.data.status !== "success") {
    throw new Error("Payment verification failed");
  }

  const payment = await prisma.payment.update({
    where: { paystackRef: reference },
    data: {
      status: "SUCCESS",
      channel: data.data.channel,
      paidAt: new Date(),
    },
    include: { order: true },
  });

  await prisma.order.update({
    where: { id: payment.orderId },
    data: {
      status: "CONFIRMED",
      trackingEvents: {
        create: {
          status: "CONFIRMED",
          message: "Payment confirmed. Your order is being processed.",
          location: "Venda Warehouse",
        },
      },
    },
  });

  return payment;
};

export const handleWebhook = async (event: any) => {
  if (event.event === "charge.success") {
    const reference = event.data.reference;
    await verifyPayment(reference);
  }
};
