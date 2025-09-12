import type { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { AccountStatus } from '@prisma/client'

const prisma = new PrismaClient()

const loginUser = async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase()
    const password = String(req.body?.password || '')

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
        role: true,          
        status: true,       
        doctor: {           
          select: {
            id: true,
            specialty: { select: { id: true, name: true } }
          }
        },
        patient: { select: { id: true } }
      }
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    if (user.status !== AccountStatus.ACCEPTED) {
      if (user.status === AccountStatus.PENDING) {
        return res.status(403).json({ message: 'Account not approved yet.' })
      }
      if (user.status === AccountStatus.DECLINED) {
        return res.status(403).json({ message: 'Your account was rejected. You are not allowed to access this website.' })
      }
      
      return res.status(403).json({ message: `Account status: ${user.status}` })
    }

   
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,       
        doctorId: user.doctor?.id ?? null,
        patientId: user.patient?.id ?? null
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '2h' }
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    })

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,       // enum string
        status: user.status,   // enum string
        doctor: user.doctor ?? null,
        patient: user.patient ?? null
      }
    })
  } catch (error: any) {
    console.error(error)
    return res.status(500).json({ message: error?.message || 'Login error' })
  }
}


const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "producation",
        sameSite: "Lax",
    });
    res.status(200).json({ message: "Logged out successfully" });

}
export { loginUser, logoutUser };
