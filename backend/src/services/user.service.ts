import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface UserInput {
  full_name: string;
  email: string;
  password: string;
  roleId: number;
  statusId?: number;
}

export const createUser = async ({ full_name, email, password, roleId }: UserInput) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const pendingStatus = await prisma.status.findUnique({ where: { name: "pending" } });
  if (!pendingStatus) {
    throw new Error("Status 'pending' not found.");
  }

  const user = await prisma.user.create({
    data: {
      full_name,
      email,
      password: hashedPassword,
      roleId,
      statusId: pendingStatus.id,
    },
    select: {
      id: true,
      full_name: true,
      email: true,
      roleId: true,
      statusId: true,
    },
  });

  return user;
};
