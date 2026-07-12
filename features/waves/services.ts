"use server";

import { prisma } from "@/lib/prisma";
import { CreateWaveInput, UpdateWaveInput } from "./schemas";
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
    const lastWave = await prisma.wave.findFirst({
      orderBy: { startDate: "desc" },
      where: { trainingProgramId: waveData.trainingProgramId },
    });

    if (lastWave && lastWave.status !== "FINISHED") {
      throw new ConflictError(
        {},
        "Il existe déja une vague avec des inscriptions en cours pour ce parcours de formation",
      );
    }

    const wave = await prisma.wave.create({
      data: {
        ...waveData,
        status: "PENDING",
      },
    });

    return wave;
  } catch (error) {
    console.log(error);
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

export async function lockWaveCourse(waveId: Identifier): Promise<Wave> {
  try {
    let wave = await prisma.wave.findUniqueOrThrow({ where: { id: waveId } });

    wave.status = "FINISHED"; // finish course course

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

export async function unlockWaveCourse(waveId: Identifier): Promise<Wave> {
  try {
    let wave = await prisma.wave.findUniqueOrThrow({ where: { id: waveId } });

    wave.status = "PENDING"; // reopen course

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
