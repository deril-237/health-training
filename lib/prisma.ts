import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

export const prismaErrorcode = {
  unique: "P2002",
  foreignKey: "P2003",
  notExist: "P2025",
};

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
