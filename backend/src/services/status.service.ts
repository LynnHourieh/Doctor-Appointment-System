import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getStatusByName = async (name) => {
  return prisma.status.findUnique({ where: { name } });
};