"use client";

import { callAction } from "@/lib/callAction";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWaveAction, updateWaveAction } from "./action";
import { CreateWaveInput, UpdateWaveInput } from "./schema";
import { PaginationParams } from "@/lib/pagination";
import { FilterWave } from "./types";
import { Identifier } from "@/interfaces/entities";

export const waveKeys = {
  all: ["waves"] as const,
  list: (params: PaginationParams, filter: FilterWave) =>
    [...waveKeys.all, "list", params, filter] as const,
  detail: (id: Identifier) => [...waveKeys.all, "detail", id],
};

export function useUpdateWave(waveId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: UpdateWaveInput) =>
      callAction(updateWaveAction, waveId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waveKeys.all });
      queryClient.invalidateQueries({ queryKey: waveKeys.detail(waveId) });
    },
  });
}

export function useCreateWave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: CreateWaveInput) =>
      callAction(createWaveAction, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waveKeys.all });
    },
  });
}
