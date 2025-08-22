import { PrismaClient } from '@prisma/client';
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const roles = ['admin', 'doctor', 'patient'];
  const statuses = ['pending', 'approved', 'rejected'];
  const specialties = [
    "Cardiologist",
    "Dentist",
    "Dermatologist",
    "General Practitioner",
    "Pediatrician",
    "Neurologist",
    "Psychiatrist"
  ];

  console.log("Seeding roles...");
  for (const name of roles) {
    const existing = await prisma.role.findUnique({ where: { name } });
    if (!existing) {
      await prisma.role.create({ data: { name } });
      console.log(`✅ Role created: ${name}`);
    } else {
      console.log(`🔁 Role already exists: ${name}`);
  }

  console.log("Seeding statuses...");
  for (const name of statuses) {
    const existing = await prisma.status.findUnique({ where: { name } });
    if (!existing) {
      await prisma.status.create({ data: { name } });
      console.log(`✅ Status created: ${name}`);
    } else {
      console.log(`🔁 Status already exists: ${name}`);
    }
  }
  console.log("Seeding specialties...");
  for (const name of specialties) {
    const existing = await prisma.specialty.findUnique({ where: { name } });
    if (!existing) {
      await prisma.specialty.create({ data: { name } });
      console.log(`✅ Specialty created: ${name}`);
    } else {
      console.log(`🔁 Specialty already exists: ${name}`);
    }
  }
}


  const roleAdmin = await prisma.role.findUnique({ where: { name: 'admin' } });
  const roleDoctor = await prisma.role.findUnique({ where: { name: 'doctor' } });
  const rolePatient = await prisma.role.findUnique({ where: { name: 'patient' } });
  const statusApproved = await prisma.status.findUnique({ where: { name: 'approved' } });
  const specialty = await prisma.specialty.findFirst();

  const hashedPassword = await bcrypt.hash("123456789", 10);

  // --- Admin user ---
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      fullName: "Admin User",
      email: "admin@gmail.com",
      password: hashedPassword,
      roleId: roleAdmin!.id,
      statusId: statusApproved!.id,
      gender: "male",
      dateOfBirth: "1980-01-01",
    },
  });

  // --- Doctor user ---
  const doctorUser = await prisma.user.upsert({
    where: { email: "doctor@gmail.com" },
    update: {},
    create: {
      fullName: "Dr. Ahmad",
      email: "doctor@gmail.com",
      password: hashedPassword,
      roleId: roleDoctor!.id,
      statusId: statusApproved!.id,
      gender: "male",
      dateOfBirth: "1975-06-15",
    },
  });

  await prisma.doctor.upsert({
    where: { id: doctorUser.id },
    update: {},
    create: {
      id: doctorUser.id, // manually set to match User.id
      bio: "Cardiology expert with 20 years of experience.",
      phone: "+123456789",
      license_number: "DOC00123",
      education: "Harvard Medical School",
      experience_years: 20,
      languages: "English, Arabic",
      photo_url: null,
      clinic_name: "Health First Clinic",
      location: "Beirut",
      specialtyId: specialty!.id,
      is_active: true,
    },
  });

  // --- Patient user ---
  const patientUser = await prisma.user.upsert({
    where: { email: "patient@gmail.com" },
    update: {},
    create: {
      fullName: "Hind Hourieh",
      email: "patient@gmail.com",
      password: hashedPassword,
      roleId: rolePatient!.id,
      statusId: statusApproved!.id,
      gender: "female",
      dateOfBirth: "1990-09-30",
    },
  });

  await prisma.patient.upsert({
    where: { id: patientUser.id },
    update: {},
    create: {
      id: patientUser.id,
      phone: "+987654321",
      address: "Zahle, Lebanon",
      known_conditions: ["Diabetes","Blood Pressure"],
      allergies: ["Penicillin"],
      blood_type: "A+",
      weight_kg: 68.5,
      height_cm: 165,
    },
  });

  console.log("✅ Users seeded.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());