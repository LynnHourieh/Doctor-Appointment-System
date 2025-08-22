// controllers/authController.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

import dotenv from "dotenv";
dotenv.config();
const prisma = new PrismaClient();

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        // Check user exists
        const user = await prisma.user.findUnique({
            where: { email },
            include: { status: true, role: true } // Include status and role for further checks
        });
        if (!user) return res.status(401).json({ message: "Invalid credentials." });

        // Check status
        if (user.status.name === "pending") {
            return res.status(403).json({ message: "Account not approved yet." });
        }

        if (user.status.name === "rejected") {
            return res.status(403).json({ message: "Your account was rejected. You are not allowed to access this website." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

        // Sign JWT
        const token = jwt.sign(
            {
                userId: user.id,
                roleId: user.roleId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,            // Set true in production (requires HTTPS)
            sameSite: "Strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name,
                status: user.status.name,
            },

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message || "Login error" });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "producation",
        sameSite: "Lax",
    });
    res.status(200).json({ message: "Logged out successfully" });

}
export { loginUser, logoutUser };
