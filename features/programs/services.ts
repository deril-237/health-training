import { prisma } from "@/lib/prisma";
import { CreateProgramInput, UpdateProgramInput } from "./schemas";
import { handlePrismaError } from "@/lib/errors/handlePrismaError";
import {
  PaginationParams,
  getPaginationParams,
  buildPaginatedResult,
} from "@/lib/pagination";
import { Identifier } from "@/interfaces/entities";

export async function createProgram(programData: CreateProgramInput) {
  try {
    const result = await prisma.program.create({ data: programData });

    return result;
  } catch (error) {
    handlePrismaError(error, {
      unique: { duration: "un parcours avec cette durée existe déja" },
      internalError: "Erreur lors de l'enregistrement du parcour",
    });
  }
}

export async function updateProgram(
  programId: Identifier,
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

export async function getListProgram() {
  const program = await prisma.program.findMany();

  return program;
}

export async function deleteProgram(programId: Identifier) {
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
