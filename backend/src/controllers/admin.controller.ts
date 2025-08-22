import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/sendEmail";
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
        fullName: true,
        email: true,
        role: { select: { name: true } },
        dateOfBirth: true,
        created_at: true,
        gender: true,
        doctor: {
          select: {
            specialty: {
              select: { name: true }
            }
          }
        }
      }
    });

    // Clean response: attach specialty only if role is "doctor"
    const formatted = users.map(user => ({
      ...user,
      specialty: user.role.name === "doctor" && user.doctor?.specialty
        ? user.doctor.specialty.name
        : null
    }));

    res.json(formatted);
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
    const subject =
      action === "accept"
        ? "✅ Your Account Has Been Approved"
        : "❌ Your Account Has Been Rejected";

    const html =
      action === "accept"
        ? `<p>Dear ${user.fullName},</p>
           <p>Your account has been <strong>approved</strong>. You can now access the system.</p>`
        : `<p>Dear ${user.fullName},</p>
           <p>We regret to inform you that your account has been <strong>rejected</strong>.</p>
           <p>If you believe this is a mistake, please contact support.</p>`;

    await sendEmail(user.email, subject, html);

    res.json({ message: `User ${action}ed successfully.`, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error: error.message });
  }
};
