import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create roles
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });

  console.log("Roles seeded:", { adminRole, userRole });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
