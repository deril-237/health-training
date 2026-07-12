"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { action } from "@/lib/callAction";
import { FIRST_PAGE, type PaginationParams } from "@/lib/pagination";
import { getTrainingListAction, getTrainingProgramList } from "./actions";
import type { Identifier } from "@/interfaces/entities";

export const trainingKeys = {
  all: ["trainings"] as const,
  list: (params: PaginationParams) =>
    [...trainingKeys.all, "list", params] as const,
  programs: (trainingId: Identifier) =>
    [...trainingKeys.all, "programs", trainingId] as const,
};

export function useGetTrainingList(page = FIRST_PAGE) {
  return useQuery({
    queryKey: trainingKeys.list({ page }),
    queryFn: async () => {
      const result = await getTrainingListAction({ page });

      if (result.success === false) {
        throw new Error(
          result.error.global ??
            "Erreur est survenue pendant le chargement des donnée",
        );
      }

      return result.data;
    },
  });
}

export function useInfiniteGetTrainingList() {
  return useInfiniteQuery({
    queryKey: trainingKeys.all,
    queryFn: async ({ pageParam }) => {
      const result = await getTrainingListAction({ page: pageParam });

      if (result.success === false) {
        throw new Error(
          result.error.global ??
            "Erreur est survenue pendant le chargement des donnée",
        );
      }

      return result.data;
    },
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage) => lastPage.meta.currentPage + 1,
    getPreviousPageParam: (lastPage) => lastPage.meta.currentPage - 1,
  });
}

export function useGetTrainingProgramList(trainingId: Identifier) {
  return useQuery({
    queryKey: trainingKeys.programs(trainingId),
    queryFn: async () => {
      const result = await getTrainingProgramList(trainingId);

      if (result.success === false) {
        throw new Error(
          result.error.global ??
            "Erreur est survenue pendant le chargement des donnée",
        );
      }

      return result.data;
    },
    enabled: Boolean(trainingId),
  });
}
