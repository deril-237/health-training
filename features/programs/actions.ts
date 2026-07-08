"use server";

import { ServerAction } from "@/interfaces/actions";
import * as programsService from "./services";
import { validateData } from "@/lib/form";
import {
  CreateProgramInput,
  createProgramSchema,
  UpdateProgramInput,
  updateProgramSchema,
} from "./schema";
import { responseHelper } from "@/lib/response";
import { resolverErrorToHttp } from "@/lib/errors/resolverErrorToHttp";
import zod from "zod";
import { PaginatedResult, PaginationParams } from "@/lib/pagination";
import { Program } from "./types";
import { toValidationErrorResponse } from "@/lib/errors/toValidationErrorResponse";
import { Identifier } from "@/interfaces/entities";

export const createProgramAction: ServerAction<
  [FormData],
  Program,
  CreateProgramInput
> = async (formData) => {
  const programData = await validateData({
    formData,
    schema: createProgramSchema,
  });

  if (programData.success === false) {
    return toValidationErrorResponse<CreateProgramInput>(programData.errors);
  }

  try {
    const result = await programsService.createProgram(programData.data);

    return responseHelper.success(result, 201);
  } catch (error) {
    const result = resolverErrorToHttp<CreateProgramInput>(error);

    return result;
  }
};

export const updateProgramAction: ServerAction<[string, FormData]> = async (
  programId: Identifier,
  formData: FormData,
) => {
  const programData = await validateData({
    formData,
    schema: updateProgramSchema,
  });

  if (programData.success === false) {
    return toValidationErrorResponse<UpdateProgramInput>(programData.errors);
  }

  const programIdParsedResult = zod.cuid2().safeParse(programId);
  if (!programIdParsedResult.success) {
    return responseHelper.error({
      statusCode: 404,
    });
  }

  const programIdParsed = programIdParsedResult.data;

  try {
    const result = await programsService.updateProgram(
      programIdParsed,
      programData.data,
    );

    return responseHelper.success(result, 200);
  } catch (error) {
    const result = resolverErrorToHttp(error);

    return result;
  }
};

export const getListProgramAction: ServerAction<
  [PaginationParams],
  PaginatedResult<Program>
> = async (paginationParams) => {
  const programList = await programsService.getListProgram(paginationParams);

  return responseHelper.success(programList, 200);
};

export const deleteProgramAction: ServerAction<[string]> = async (
  programId: string,
) => {
  const programIdParsedResult = zod.cuid2().safeParse(programId);
  if (!programIdParsedResult.success) {
    return responseHelper.error({
      statusCode: 404,
    });
  }

  const programIdParsed = programIdParsedResult.data;

  try {
    await programsService.deleteProgram(programIdParsed);
    return responseHelper.success(undefined, 204);
  } catch (error) {
    const result = resolverErrorToHttp(error);

    return result;
  }
};
