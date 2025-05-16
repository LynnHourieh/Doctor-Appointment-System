import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getPendingUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        status: {
          name: "pending"
        }
      },
      select: {
        id: true,
        full_name: true,
        email: true,
        roleId: true,
        status: { select: { name: true } }
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch pending users" });
  }
};

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "accept" or "reject"

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  const newStatus = action === "accept" ? "approved" : "rejected";

  try {
    const status = await prisma.status.findUnique({ where: { name: newStatus } });
    if (!status) {
      return res.status(500).json({ message: `Status '${newStatus}' not found in DB.` });
    }

    const user = await prisma.user.update({
      where: { id: id },
      data: { statusId: status.id },
      include: { status: true }
    });

    res.json({ message: `User ${action}ed successfully.`, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error: error.message });
  }
};
