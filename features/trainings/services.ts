"use server";

import { Identifier } from "@/interfaces/entities";
import {
  PaginationParams,
  getPaginationParams,
  buildPaginatedResult,
} from "@/lib/pagination";
import { prisma } from "@/lib/prisma";

export async function getTrainingList(paginationParams: PaginationParams) {
  const { skip, page, limit } = getPaginationParams(paginationParams);
  const [program, totalItems] = await Promise.all([
    prisma.training.findMany({
      skip,
      take: limit,
    }),
    prisma.training.count(),
  ]);

  const result = buildPaginatedResult(program, {
    currentPage: page,
    totalItems,
    limit,
  });

  return result;
}

export async function getTrainingProgram(trainingId: Identifier) {
  const program = await prisma.trainingProgram.findMany({
    where: {
      trainingId,
    },
    include: {
      program: true,
    },
  });

  return program;
}
