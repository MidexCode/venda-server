import { prisma } from "../../config/db";

export const getAllCategories = async () => {
  return prisma.category.findMany({
    where: { parentId: null },
    include: {
      children: true,
    },
  });
};

export const createCategory = async (data: {
  name: string;
  slug: string;
  iconUrl?: string;
  parentId?: string;
}) => {
  return prisma.category.create({ data });
};
