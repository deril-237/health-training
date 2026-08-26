import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { addTrainingAndProgram } from "./seeds/addTrainingsAndPrograms";
import { addQuestions } from "./seeds/addQuestions";
import { createAdminUser } from "./seeds/createAdminUser";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    await addTrainingAndProgram(prisma);
  }

  await addQuestions(prisma);

  await createAdminUser(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
