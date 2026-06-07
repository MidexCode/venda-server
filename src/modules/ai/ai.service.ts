import { prisma } from "../../config/db";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const callGemini = async (prompt: string): Promise<string> => {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = (await response.json()) as any;
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
};

export const aiSearch = async (query: string) => {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      images: true,
      slug: true,
      rating: true,
      category: { select: { name: true } },
      seller: { select: { storeName: true } },
    },
    take: 100,
  });

  const productList = products
    .map(
      (p, i) =>
        `${i + 1}. ID: ${p.id} | Name: ${p.name} | Category: ${p.category.name} | Price: ₦${p.price} | Rating: ${p.rating}`,
    )
    .join("\n");

  const prompt = `
You are a smart product search assistant for Venda, a premium Nigerian marketplace.

User searched for: "${query}"

Here are the available products:
${productList}

Return the IDs of the top 10 most relevant products for this search query as a JSON array.
Only return a valid JSON array of product IDs, nothing else.
Example: ["id1", "id2", "id3"]
`;

  const result = await callGemini(prompt);

  let relevantIds: string[] = [];
  try {
    const cleaned = result.replace(/```json|```/g, "").trim();
    relevantIds = JSON.parse(cleaned);
  } catch {
    relevantIds = [];
  }

  if (relevantIds.length === 0) return products.slice(0, 10);

  const ranked = relevantIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  return ranked;
};

export const getRecommendations = async (userId: string) => {
  const recentOrders = await prisma.orderItem.findMany({
    where: { order: { userId } },
    include: { product: { select: { categoryId: true } } },
    take: 5,
    orderBy: { order: { createdAt: "desc" } },
  });

  const categoryIds = recentOrders.map((o) => o.product.categoryId);

  if (categoryIds.length === 0) {
    return prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 10,
      include: {
        category: { select: { name: true } },
        seller: { select: { storeName: true } },
      },
    });
  }

  return prisma.product.findMany({
    where: {
      isActive: true,
      categoryId: { in: categoryIds },
    },
    take: 10,
    orderBy: { rating: "desc" },
    include: {
      category: { select: { name: true } },
      seller: { select: { storeName: true } },
    },
  });
};

export const chatAssistant = async (message: string, userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const prompt = `
You are Venda AI, a helpful shopping assistant for Venda — a premium Nigerian marketplace.
You help customers find products, answer questions about orders, and give shopping advice.
Keep responses concise, friendly, and relevant to Nigerian shopping context.
Use Naira (₦) for prices when mentioned.

Customer (${user?.name ?? "Guest"}): ${message}

Respond helpfully in 2-3 sentences max.
`;

  return callGemini(prompt);
};
