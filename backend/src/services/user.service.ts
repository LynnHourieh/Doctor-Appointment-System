import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface DoctorData {
  specialtyId: number;
  is_active?: boolean;
  phone?: string;
  bio?: string;
  license_number?: string;
  education?: string;
  languages?: string;
  clinic_name?: string;
  location?: string;
}

interface PatientData {
  phone?: string;
  address?: string;
  known_conditions?: string[];
  allergies?: string;
  blood_type?: string;
  weight_kg?: number;
  height_cm?: number;
}

export interface UserInput {
  fullName: string;
  email: string;
  password: string;
  roleId: number;
  statusId?: number;
  gender?: string;
  dateOfBirth?: string;
  doctorData?: DoctorData;
  patientData?: PatientData;
}


export const createUser = async ({
  fullName,
  email,
  password,
  roleId,
  statusId,
  gender,
  dateOfBirth,
  doctorData,
  patientData,
}: UserInput) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);


  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      roleId,
      statusId,
      gender,
      dateOfBirth,
      doctor: doctorData ? { create: doctorData } : undefined,
      patient: patientData ? { create: patientData } : undefined,
    },
    include: {
      doctor: true,
      patient: true,
    },
  });

  return user;
};
