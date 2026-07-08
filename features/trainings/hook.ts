"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { callAction } from "@/lib/callAction";
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
    queryFn: async () => callAction(getTrainingListAction, { page }),
  });
}

export function useInfiniteGetTrainingList() {
  return useInfiniteQuery({
    queryKey: trainingKeys.all,
    queryFn: ({ pageParam }) =>
      callAction(getTrainingListAction, { page: pageParam }),
    initialPageParam: FIRST_PAGE,
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.meta.currentPage + 1,
    getPreviousPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.meta.currentPage - 1,
  });
}

export function useGetTrainingProgramList(trainingId: Identifier) {
  return useQuery({
    queryKey: trainingKeys.programs(trainingId),
    queryFn: async () => callAction(getTrainingProgramList, trainingId),
    enabled: Boolean(trainingId),
  });
}
