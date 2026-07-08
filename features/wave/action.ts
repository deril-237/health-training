import { ServerAction } from "@/interfaces/actions";
import { FilterWave, Wave, WaveList } from "./types";
import { validateData } from "@/lib/form";
import {
  CreateWaveInput,
  createWaveSchema,
  UpdateWaveInput,
  updateWaveSchema,
} from "./schema";
import { responseHelper } from "@/lib/response";
import { toValidationErrorResponse } from "@/lib/errors/toValidationErrorResponse";
import * as waveService from "./services";
import { resolverErrorToHttp } from "@/lib/errors/resolverErrorToHttp";
import { Identifier } from "@/interfaces/entities";
import zod from "zod";
import { PaginationParams } from "@/lib/pagination";

export const createWaveAction: ServerAction<
  [FormData | CreateWaveInput],
  Wave,
  CreateWaveInput
> = async (formData) => {
  const resultValidation = await validateData({
    formData,
    schema: createWaveSchema,
  });

  if (resultValidation.success === false) {
    return toValidationErrorResponse<CreateWaveInput>(resultValidation.errors);
  }

  try {
    const wave = await waveService.createWave(resultValidation.data);

    return responseHelper.success(wave, 201);
  } catch (error) {
    return resolverErrorToHttp(error);
  }
};

export const updateWaveAction: ServerAction<
  [Identifier, FormData | UpdateWaveInput],
  Wave,
  UpdateWaveInput
> = async (waveId, formData) => {
  const waveIdParsedResult = zod.cuid2().safeParse(waveId);
  if (!waveIdParsedResult.success) {
    return responseHelper.error({
      statusCode: 404,
    });
  }

  const waveIdParsed = waveIdParsedResult.data;

  const waveData = await validateData({
    formData,
    schema: updateWaveSchema,
  });

  if (waveData.success === false) {
    return toValidationErrorResponse<UpdateWaveInput>(waveData.errors);
  }

  try {
    const result = await waveService.updateWave(waveIdParsed, waveData.data);

    return responseHelper.success(result, 200);
  } catch (error) {
    const result = resolverErrorToHttp(error);

    return result;
  }
};

export const getWaveList: ServerAction<
  [PaginationParams, FilterWave],
  WaveList
> = async (paginationParams, filterWave) => {
  const waveList = await waveService.getListWave(paginationParams, filterWave);

  return responseHelper.success(waveList);
};
