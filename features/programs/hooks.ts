"use client";

import { FIRST_PAGE, PaginationParams } from "@/lib/pagination";
import {
  createProgramAction,
  deleteProgramAction,
  getProgramListAction,
  updateProgramAction,
} from "./actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const programKeys = {
  all: ["programs"] as const,
  list: (params: PaginationParams) =>
    [...programKeys.all, "list", params] as const,
  detail: (id: string) => [...programKeys.all, "detail", id] as const,
};

export function useCreateProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      const result = await createProgramAction(data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
}

export function useMutationProgram(programId?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: FormData) => {
      if (programId) {
        return await updateProgramAction(programId, data);
      }
      return await createProgramAction(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
}

export function useGetProgramList(page = FIRST_PAGE) {
  return useQuery({
    queryKey: programKeys.list({ page }),
    queryFn: async () => {
      const result = await getProgramListAction();

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

export function useDeleteProgram() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (programId: string) => {
      return await deleteProgramAction(programId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
}
