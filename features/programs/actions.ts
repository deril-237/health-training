"use server";

import { ServerAction } from "@/interfaces/actions";
import * as programsService from "./services";
import { validateData } from "@/lib/form";
import {
  CreateProgramInput,
  createProgramSchema,
  UpdateProgramInput,
  updateProgramSchema,
} from "./schemas";
import { responseHelper } from "@/lib/response";
import zod from "zod";
import { Identifier } from "@/interfaces/entities";
import { action } from "@/lib/callAction";
import { NotFoundError, ValidationError } from "@/lib/errors/appError";

export const createProgramAction = action(
  async (formData: FormData | CreateProgramInput) => {
    const programData = await validateData({
      formData,
      schema: createProgramSchema,
    });

    if (programData.success === false) {
      throw new ValidationError(programData.errors.fieldsErrors ?? {});
    }

    const result = await programsService.createProgram(programData.data);

    return result;
  },
);

export const updateProgramAction = action(
  async (programId: Identifier, formData: FormData | UpdateProgramInput) => {
    const programData = await validateData({
      formData,
      schema: updateProgramSchema,
    });

    if (programData.success === false) {
      throw new ValidationError(programData.errors.fieldsErrors ?? {});
    }

    const programIdParsedResult = zod.cuid2().safeParse(programId);
    if (!programIdParsedResult.success) {
      throw new NotFoundError("the program don't exist");
    }

    const programIdParsed = programIdParsedResult.data;

    const result = await programsService.updateProgram(
      programIdParsed,
      programData.data,
    );

    return result;
  },
);

export const getProgramListAction = action(async () => {
  const programList = await programsService.getListProgram();

  return programList;
});

export const deleteProgramAction = action(async (programId: string) => {
  const programIdParsedResult = zod.cuid2().safeParse(programId);
  if (!programIdParsedResult.success) {
    return responseHelper.error({
      statusCode: "NOT_FOUND",
    });
  }

  const programIdParsed = programIdParsedResult.data;

  await programsService.deleteProgram(programIdParsed);
});

// export const createProgramAction: ServerAction<
//   [FormData],
//   Program,
//   CreateProgramInput
// > = async (formData) => {
//   const programData = await validateData({
//     formData,
//     schema: createProgramSchema,
//   });

//   if (programData.success === false) {
//     return toValidationErrorResponse<CreateProgramInput>(programData.errors);
//   }

//   try {
//     const result = await programsService.createProgram(programData.data);

//     return responseHelper.success(result);
//   } catch (error) {
//     const result = resolverErrorToHttp<CreateProgramInput>(error);

//     return result;
//   }
// };

// export const updateProgramAction: ServerAction<[string, FormData]> = async (
//   programId: Identifier,
//   formData: FormData,
// ) => {
//   const programData = await validateData({
//     formData,
//     schema: updateProgramSchema,
//   });

//   if (programData.success === false) {
//     return toValidationErrorResponse<UpdateProgramInput>(programData.errors);
//   }

//   const programIdParsedResult = zod.cuid2().safeParse(programId);
//   if (!programIdParsedResult.success) {
//     return responseHelper.error({
//       statusCode: "NOT_FOUND",
//     });
//   }

//   const programIdParsed = programIdParsedResult.data;

//   try {
//     const result = await programsService.updateProgram(
//       programIdParsed,
//       programData.data,
//     );

//     return responseHelper.success(result);
//   } catch (error) {
//     const result = resolverErrorToHttp(error);

//     return result;
//   }
// };

// export const getListProgramAction: ServerAction<
//   [PaginationParams],
//   PaginatedResult<Program>
// > = async (paginationParams) => {
//   const programList = await programsService.getListProgram(paginationParams);

//   return responseHelper.success(programList);
// };

// export const deleteProgramAction: ServerAction<[string]> = async (
//   programId: string,
// ) => {
//   const programIdParsedResult = zod.cuid2().safeParse(programId);
//   if (!programIdParsedResult.success) {
//     return responseHelper.error({
//       statusCode: "NOT_FOUND",
//     });
//   }

//   const programIdParsed = programIdParsedResult.data;

//   try {
//     await programsService.deleteProgram(programIdParsed);
//     return responseHelper.success(undefined);
//   } catch (error) {
//     const result = resolverErrorToHttp(error);

//     return result;
//   }
// };
