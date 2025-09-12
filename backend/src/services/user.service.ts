import { PrismaClient, Role, AccountStatus, Gender } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// ---------- Helpers ----------
const toRole = (raw?: string | number): Role => {
  if (typeof raw === 'number') {
    if (raw === 1) return Role.ADMIN
    if (raw === 2) return Role.DOCTOR
    return Role.PATIENT
  }
  const r = String(raw ?? '').trim().toUpperCase()
  if (r === 'ADMIN') return Role.ADMIN
  if (r === 'DOCTOR') return Role.DOCTOR
  return Role.PATIENT
}

const toGender = (raw?: string): Gender | null => {
  if (!raw) return null
  const g = raw.trim().toUpperCase()
  if (g === 'MALE') return Gender.MALE
  if (g === 'FEMALE') return Gender.FEMALE
  return null
}

const toAccountStatus = (raw?: string): AccountStatus | null => {
  if (!raw) return null
  const s = raw.trim().toUpperCase()
  if (s === 'PENDING') return AccountStatus.PENDING
  if (s === 'ACCEPTED' || s === 'APPROVED') return AccountStatus.ACCEPTED
  if (s === 'DECLINED' || s === 'REJECTED') return AccountStatus.DECLINED
  return null
}

const toStringArray = (val: unknown): string[] | undefined => {
  if (val == null) return undefined
  if (Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean)
  return String(val).split(/[,;]+/).map(s => s.trim()).filter(Boolean)
}

const numOrNull = (v: unknown): number | null =>
  v === '' || v == null ? null : (Number.isFinite(Number(v)) ? Number(v) : null)

// ---------- Input types (API payload) ----------
interface DoctorDataInput {
  specialtyId: number
  is_active?: boolean
  phone?: string
  bio?: string
  license_number?: string
  education?: string
  languages?: string | string[] // string[] in DB; accept CSV/string and normalize
  clinic_name?: string
  location?: string
}

interface PatientDataInput {
  phone?: string
  address?: string
  known_conditions?: string | string[] // string[] in DB; accept CSV
  allergies?: string | string[]        // string[] in DB; accept CSV
  blood_type?: string
  weight_kg?: number | string
  height_cm?: number | string
}

export interface UserInput {
  fullName: string
  email: string
  password: string
  role?: Role | 'ADMIN' | 'DOCTOR' | 'PATIENT'
  roleId?: number // legacy: 1=ADMIN, 2=DOCTOR, 3=PATIENT
  status?: string // optional legacy string; default decided below
  gender?: string
  dateOfBirth: string // ISO/date-like string
  doctorData?: DoctorDataInput
  patientData?: PatientDataInput
}

// ---------- Service ----------
export const createUser = async ({
  fullName,
  email,
  password,
  role,
  roleId,
  status,
  gender,
  dateOfBirth,
  doctorData,
  patientData,
}: UserInput) => {
  // Uniqueness
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw new Error('User with this email already exists.')

  // Enums & date
  const roleEnum = toRole(role ?? roleId)
  const genderEnum = toGender(gender)
  if (!genderEnum) throw new Error('gender must be MALE or FEMALE')

  const dob = new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) throw new Error('dateOfBirth must be a valid date (e.g. 1990-09-30)')

  const statusEnum =
    toAccountStatus(status) ??
    (roleEnum === Role.ADMIN ? AccountStatus.ACCEPTED : AccountStatus.PENDING)

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Normalize doctor/patient inputs
  const languagesArr = toStringArray(doctorData?.languages) ?? []
  const knownArr = toStringArray(patientData?.known_conditions) ?? []
  const allergyArr = toStringArray(patientData?.allergies) ?? []

  // Single nested create. IMPORTANT:
  // - No roleId/statusId (use enums)
  // - For Doctor: use specialty relation connect (NOT specialtyId scalar)
  // - For shared-PK: Prisma sets Doctor/Patient.id automatically via relation
  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
      role: roleEnum,
      status: statusEnum,
      gender: genderEnum,
      dateOfBirth: dob,

      ...(roleEnum === Role.DOCTOR && doctorData
        ? {
            doctor: {
              create: {
                specialty: { connect: { id: Number(doctorData.specialtyId) } },
                is_active: doctorData.is_active ?? true,
                phone: doctorData.phone ?? null,
                bio: doctorData.bio ?? null,
                license_number: doctorData.license_number ?? null,
                education: doctorData.education ?? null,
                languages: languagesArr, // String[]
                clinic_name: doctorData.clinic_name ?? null,
                location: doctorData.location ?? null,
              },
            },
          }
        : {}),

      ...(roleEnum === Role.PATIENT && patientData
        ? {
            patient: {
              create: {
                phone: patientData.phone ?? null,
                address: patientData.address ?? null,
                known_conditions: knownArr, // String[]
                allergies: allergyArr,      // String[]
                blood_type: patientData.blood_type ?? null,
                weight_kg: numOrNull(patientData.weight_kg),
                height_cm: numOrNull(patientData.height_cm),
              },
            },
          }
        : {}),
    },
    include: {
      doctor: { include: { specialty: true } },
      patient: true,
    },
  })

  return user
}
