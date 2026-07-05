import { PrismaClient, Prisma } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const formationData: Prisma.FormationCreateInput[] = [
  {
    name: "Formation 1",
    description: "Alice is a software engineer with 5 years of experience.",
    image: "",
  },
  {
    name: "Formation 2",
    description: "Bob is a data scientist with 3 years of experience.",
    image: "",
  },
  {
    name: "Formation 3",
    description: "Charlie is a product manager with 4 years of experience.",
    image: "",
  },
];

export async function main() {
  for (const u of formationData) {
    await prisma.formation.create({ data: u });
  }
}

main();
