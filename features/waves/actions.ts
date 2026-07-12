"use server";

import { FilterWave } from "./types";
import { validateData } from "@/lib/form";
import {
  CreateWaveInput,
  createWaveSchema,
  UpdateWaveInput,
  updateWaveSchema,
} from "./schemas";
import * as waveService from "./services";
import { Identifier } from "@/interfaces/entities";
import zod from "zod";
import { PaginationParams } from "@/lib/pagination";
import { action } from "@/lib/callAction";
import { NotFoundError, ValidationError } from "@/lib/errors/appError";
import { parseOrThrow } from "@/lib/zodRules";

export const createWaveAction = action(
  async (formData: FormData | CreateWaveInput) => {
    const resultValidation = await validateData({
      formData,
      schema: createWaveSchema,
    });

    if (resultValidation.success === false) {
      throw new ValidationError(resultValidation.errors.fieldsErrors ?? {});
    }

    const wave = await waveService.createWave(resultValidation.data);

    return wave;
  },
);

export const updateWaveAction = action(
  async (waveId: Identifier, formData: FormData | UpdateWaveInput) => {
    const waveIdParsed = parseOrThrow(
      zod.cuid2(),
      waveId,
      () => new NotFoundError(`Il existe aucun vague avec cette identifiant`),
    );

    const waveData = await validateData({
      formData,
      schema: updateWaveSchema,
    });

    if (waveData.success === false) {
      throw new ValidationError(waveData.errors.fieldsErrors ?? {});
    }

    const result = await waveService.updateWave(waveIdParsed, waveData.data);

    return result;
  },
);

export const getWaveList = action(
  async (paginationParams: PaginationParams, filterWave: FilterWave) => {
    const waveList = await waveService.getListWave(
      paginationParams,
      filterWave,
    );

    return waveList;
  },
);

export const lockWaveCourseAction = action(async (waveId: string) => {
  const waveIdParsed = parseOrThrow(
    zod.cuid2(),
    waveId,
    () => new NotFoundError(`Il existe aucun vague avec cette identifiant`),
  );
  return await waveService.lockWaveCourse(waveId);
});

export const unlockWaveCourseAction = action(async (waveId: string) => {
  const waveIdParsed = parseOrThrow(
    zod.cuid2(),
    waveId,
    () => new NotFoundError(`Il existe aucun vague avec cette identifiant`),
  );
  return await waveService.unlockWaveCourse(waveId);
});
