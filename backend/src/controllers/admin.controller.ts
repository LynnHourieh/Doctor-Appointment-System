import { PrismaClient } from "@prisma/client";
import { sendEmail } from "../utils/sendEmail";
import { AccountStatus,Role } from '@prisma/client'
import { Request, Response } from "express";
const prisma = new PrismaClient();


export const getPendingUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { status: AccountStatus.PENDING },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,          // enum scalar
        dateOfBirth: true,
        createdAt: true,     // not created_at
        gender: true,
        doctor: {
          select: {
            specialty: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    const formatted = users.map(u => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,                                  // 'ADMIN' | 'DOCTOR' | 'PATIENT'
      status: AccountStatus.PENDING,                 // we filtered by PENDING
      dateOfBirth: u.dateOfBirth,
      createdAt: u.createdAt,
      gender: u.gender,
      specialty: u.role === Role.DOCTOR
        ? u.doctor?.specialty?.name ?? null
        : null
    }))

    res.json(formatted)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch pending users' })
  }
}

export const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "accept" or "reject"

  if (!["accept", "reject"].includes(action)) {
    return res.status(400).json({ message: "Invalid action" });
  }

  const newStatus = action === "accept" ? AccountStatus.ACCEPTED : AccountStatus.DECLINED;

  try {
    const user = await prisma.user.update({
      where: { id: id },
      data: { status: newStatus },
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
