import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const roles = ['admin', 'doctor', 'patient'];
  const statuses = ['pending', 'approved', 'rejected'];

  console.log("Seeding roles...");
  for (const name of roles) {
    const existing = await prisma.role.findUnique({ where: { name } });
    if (!existing) {
      await prisma.role.create({ data: { name } });
      console.log(`✅ Role created: ${name}`);
    } else {
      console.log(`🔁 Role already exists: ${name}`);
    }
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
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
