"use client";

import { FIRST_PAGE, PaginationParams } from "@/lib/pagination";
import {
  createProgramAction,
  deleteProgramAction,
  getListProgramAction,
  updateProgramAction,
} from "./actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { callAction } from "@/lib/callAction";

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
      const result = await callAction(createProgramAction, data);
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
        return await callAction(updateProgramAction, programId, data);
      }
      return await callAction(createProgramAction, data);
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
      const result = await callAction(getListProgramAction, { page });
      return result;
    },
  });
}

export function useDeleteProgram(programId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await callAction(deleteProgramAction, programId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: programKeys.all });
    },
  });
}
