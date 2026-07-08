"use server";

import { prisma } from "@/lib/prisma";
import { CreateWaveInput, UpdateWaveInput } from "./schema";
import { handlePrismaError } from "@/lib/errors/handlePrismaError";
import {
  PaginationParams,
  getPaginationParams,
  buildPaginatedResult,
} from "@/lib/pagination";
import { FilterWave, Wave, WaveList } from "./types";
import { Identifier } from "@/interfaces/entities";
import { ConflictError } from "@/lib/errors/appError";

export async function createWave(waveData: CreateWaveInput): Promise<Wave> {
  try {
    const currentWave = await prisma.wave.findFirst({
      where: { status: "OPEN" },
    });

    if (currentWave === null) {
      throw new ConflictError(
        {},
        "Il existe déja une vague avec des inscriptions en cours pour ce parcours de formation",
      );
    }

    const wave = prisma.wave.create({
      data: {
        ...waveData,
        status: "OPEN",
      },
    });

    return wave;
  } catch (error) {
    if (error instanceof ConflictError) {
      throw error;
    }

    handlePrismaError<keyof CreateWaveInput>(error, {
      unique: {
        startDate: "Il existe une vague pour cette dans cette formation",
      },
      foreignKey: { trainingProgramId: "Cette formation n'existe pas" },
    });
  }
}

export async function getListWave(
  paginationParams: PaginationParams,
  filter: FilterWave,
): Promise<WaveList> {
  const { skip, page, limit } = getPaginationParams(paginationParams);

  const where = {
    status: filter.status,
    trainingProgramId: filter.trainingProgramId,
  };

  const [waves, totalItems] = await Promise.all([
    prisma.wave.findMany({
      where,
      skip,
      take: limit,
    }),
    prisma.wave.count({
      where,
    }),
  ]);

  const result = buildPaginatedResult(waves, {
    currentPage: page,
    totalItems,
    limit,
  });

  return result;
}

export async function updateWave(
  waveId: Identifier,
  waveData: UpdateWaveInput,
): Promise<Wave> {
  try {
    const result = await prisma.wave.update({
      where: { id: waveId },
      data: waveData,
    });

    return result;
  } catch (error) {
    handlePrismaError<keyof UpdateWaveInput>(error, {
      internalError:
        "Erreur lors de la mise à jour de la vague. Veuillez réessayer",
      unique: {
        startDate: "Un vague avec ce date existe déjà dans cette formation",
      },
      notExist: "ce vague n'existe pas",
    });
  }
}

export async function lockInscriptionInWave(waveId: Identifier): Promise<Wave> {
  try {
    let wave = await prisma.wave.findUniqueOrThrow({ where: { id: waveId } });

    if (wave.status === "FINISHED") {
      throw new ConflictError({
        status:
          "Cette vague à terminés ces cours, on ne plus ouvrit les inscriptions",
      });
    }

    wave.status = "PENDING"; // open course

    wave = await prisma.wave.update({
      where: { id: waveId },
      data: wave,
    });

    return wave;
  } catch (error) {
    handlePrismaError<keyof UpdateWaveInput>(error, {
      internalError:
        "Erreur lors de la mise à jour de la vague. Veuillez réessayer",
      notExist: "ce vague n'existe pas",
    });
  }
}

export async function unlockInscription(waveId: Identifier): Promise<Wave> {
  try {
    let wave = await prisma.wave.findUniqueOrThrow({ where: { id: waveId } });

    if (wave.status === "FINISHED") {
      throw new ConflictError({
        status:
          "Cette vague à terminés ces cours, on ne plus ouvrit les inscriptions",
      });
    }

    wave.status = "OPEN"; // reopen inscription

    wave = await prisma.wave.update({
      where: { id: waveId },
      data: wave,
    });

    return wave;
  } catch (error) {
    handlePrismaError<keyof UpdateWaveInput>(error, {
      internalError:
        "Erreur lors de la mise à jour de la vague. Veuillez réessayer",
      notExist: "ce vague n'existe pas",
    });
  }
}
