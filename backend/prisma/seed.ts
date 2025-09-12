// prisma/seed.ts
import { PrismaClient, Role, AccountStatus, Gender } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // 1) Seed specialties (table)
  const specialties = [
    'Cardiologist',
    'Dentist',
    'Dermatologist',
    'General Practitioner',
    'Pediatrician',
    'Neurologist',
    'Psychiatrist',
  ]

  console.log('Seeding specialties...')
  for (const name of specialties) {
    await prisma.specialty.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  const specialty = await prisma.specialty.findFirst()
  if (!specialty) throw new Error('No specialties seeded')

  const hashedPassword = await bcrypt.hash('123456789', 10)

  // 2) Admin user
  await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      fullName: 'Admin User',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: Role.ADMIN,
      status: AccountStatus.ACCEPTED,
      gender: Gender.MALE,
      dateOfBirth: new Date('1980-01-01'),
    },
  })

  // 3) Doctor user
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@gmail.com' },
    update: {},
    create: {
      fullName: 'Dr. Ahmad',
      email: 'doctor@gmail.com',
      password: hashedPassword,
      role: Role.DOCTOR,
      status: AccountStatus.ACCEPTED,
      gender: Gender.MALE,
      dateOfBirth: new Date('1975-06-15'),
    },
  })

  // Doctor profile (shared PK = User.id) — connect required relation
  await prisma.doctor.upsert({
    where: { id: doctorUser.id },
    update: {},
    create: {
      // id is derived from this connect; don't pass id directly
      user: { connect: { id: doctorUser.id } },
      bio: 'Cardiology expert with 20 years of experience.',
      phone: '+123456789',
      license_number: 'DOC00123',
      education: 'Harvard Medical School',
      experience_years: 20,
      languages: ['English', 'Arabic'], // String[] in schema
      photo_url: null,
      clinic_name: 'Health First Clinic',
      location: 'Beirut',
      specialty: { connect: { id: specialty.id } }, // use relation connect
      is_active: true,
    },
  })

  // 4) Patient user
  const patientUser = await prisma.user.upsert({
    where: { email: 'patient@gmail.com' },
    update: {},
    create: {
      fullName: 'Hind Hourieh',
      email: 'patient@gmail.com',
      password: hashedPassword,
      role: Role.PATIENT,
      status: AccountStatus.ACCEPTED,
      gender: Gender.FEMALE,
      dateOfBirth: new Date('1990-09-30'),
    },
  })

  // Patient profile (shared PK = User.id) — connect required relation
  await prisma.patient.upsert({
    where: { id: patientUser.id },
    update: {},
    create: {
      // id is derived from this connect; don't pass id directly
      user: { connect: { id: patientUser.id } },
      phone: '+987654321',
      address: 'Zahle, Lebanon',
      known_conditions: ['Diabetes', 'Blood Pressure'],
      allergies: ['Penicillin'],
      blood_type: 'A+',
      weight_kg: 68.5,
      height_cm: 165,
    },
  })

  // ---- Doctor availability seed ----
const doctorId = 'bd2e784c-46f9-4bae-9d50-405c906a709e'

// Seed doctor availability for the given doctorId
await (prisma as any).doctorAvailability.createMany({
  data: [
    {
      doctorId,
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '13:00',
    },
    {
      doctorId,
      dayOfWeek: 3, // Wednesday
      startTime: '14:00',
      endTime: '18:00',
    },
    {
      doctorId,
      dayOfWeek: 5, // Friday
      startTime: '10:00',
      endTime: '15:00',
    },
  ],
  skipDuplicates: true,
})


  console.log('✅ Seed complete')
  console.log('👉 doctorId =', doctorUser.id)
  console.log('👉 patientId =', patientUser.id)
}




main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
