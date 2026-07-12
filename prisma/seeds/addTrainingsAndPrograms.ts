import {
  PrismaClient,
  Prisma,
  Program,
  Training,
} from "@/lib/generated/prisma/client";
import "dotenv/config";

// Mock trainings to insert
const trainingsData: Prisma.TrainingCreateInput[] = [
  {
    name: "Initiation à la sécurité",
    description: "Formation d'introduction aux bonnes pratiques de sécurité.",
    objective: "Connaître les bases de la sécurité en entreprise.",
    price: 0,
  },
  {
    name: "Gestion de projet agile",
    description: "Principes et pratiques de la gestion de projet agile.",
    objective: "Savoir animer des sprints et livrer par itération.",
    price: 199.0,
  },
  {
    name: "Communication efficace",
    description: "Techniques pour améliorer la communication en équipe.",
    objective: "Améliorer les échanges et la collaboration.",
    price: 49.99,
  },
];

const programData: Prisma.ProgramCreateInput = { duration: 3 };

export async function addTrainingAndProgram(prisma: PrismaClient) {
  // Create or reuse a Program with duration = 3 (months)
  const program = await prisma.program.upsert({
    where: programData as Prisma.ProgramWhereUniqueInput,
    update: {},
    create: programData,
  });

  // Upsert trainings so the seeder is idempotent
  const trainings = await prisma.training.createManyAndReturn({
    select: { id: true },
    data: trainingsData,
    skipDuplicates: true,
  });

  // Link each training to the program via TrainingProgram, avoid duplicates
  await prisma.trainingProgram.createMany({
    data: trainings.map((training) => ({
      trainingId: training.id,
      programId: program.id,
    })),
  });

  console.log(`Program ${program.id} (duration=${program.duration}) ready.`);
  console.log(`Inserted/linked ${trainings.length} trainings.`);
}
