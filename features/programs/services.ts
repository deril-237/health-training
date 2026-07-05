import { prisma } from "@/lib/prisma";
import { CreateProgramInput, UpdateProgramInput } from "./schema";
import { handlePrismaError } from "@/lib/errors/handlePrismaError";
import {
  PaginationParams,
  getPaginationParams,
  buildPaginatedResult,
} from "@/lib/pagination";

export async function createProgram(programData: CreateProgramInput) {
  try {
    const result = await prisma.program.create({ data: programData });

    return result;
  } catch (error) {
    console.log(error);
    handlePrismaError(error, {
      unique: { duration: "un parcours avec cette durée existe déja" },
      internalError: "Erreur lors de l'enregistrement du parcour",
    });
  }
}

export async function updateProgram(
  programId: string,
  programData: UpdateProgramInput,
) {
  try {
    const program = await prisma.program.update({
      data: programData,
      where: { id: programId },
    });

    return program;
  } catch (error) {
    handlePrismaError(error, {
      internalError:
        "Erreur lors de la mise à jour du parcour. Veuillez réessayer",
      unique: { duration: "Un parcours avec ce nom existe déjà" },
      notExist: "ce parcour n'existe pas",
    });
  }
}

export async function getListProgram(paginationParams?: PaginationParams) {
  const { skip, page, limit } = getPaginationParams(paginationParams);

  const [program, totalItems] = await Promise.all([
    prisma.program.findMany({
      skip,
      take: limit,
    }),
    prisma.program.count(),
  ]);

  const result = buildPaginatedResult(program, {
    currentPage: page,
    totalItems,
    limit,
  });

  return result;
}

export async function deleteProgram(programId: string) {
  try {
    const result = await prisma.program.delete({ where: { id: programId } });
    return result;
  } catch (error) {
    handlePrismaError(error, {
      notExist: `Le parcours n'existe`,
      foreignKey: { global: "Il existe des formations qui ont ce programs" },
    });
  }
}
