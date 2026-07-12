"use client";

import { action } from "@/lib/callAction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createWaveAction,
  getWaveList,
  lockWaveCourseAction,
  unlockWaveCourseAction,
  updateWaveAction,
} from "./actions";
import { CreateWaveInput, UpdateWaveInput } from "./schemas";
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
    mutationFn: (formData: UpdateWaveInput) =>
      updateWaveAction(waveId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waveKeys.all });
      queryClient.invalidateQueries({ queryKey: waveKeys.detail(waveId) });
    },
  });
}

export function useCreateWave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: CreateWaveInput) => createWaveAction(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: waveKeys.all });
    },
  });
}

export function useGetWaveList({ page }: PaginationParams, filter: FilterWave) {
  return useQuery({
    queryKey: waveKeys.list({ page }, filter),
    queryFn: async () => {
      const result = await getWaveList({ page }, filter);

      if (result.success === false) {
        throw new Error(
          result.error.global ??
            "Erreur est survenue pendant le chargment des donnée",
        );
      }

      return result.data;
    },
  });
}

export function useLockWaveCourse() {
  return useMutation({
    mutationFn: (waveId: Identifier) => lockWaveCourseAction(waveId),
  });
}

export function useUnlockWaveCourse() {
  return useMutation({
    mutationFn: (waveId: Identifier) => unlockWaveCourseAction(waveId),
  });
}
