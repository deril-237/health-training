"use server";

import { PaginatedResult, PaginationParams } from "@/lib/pagination";
import { ServerAction } from "@/interfaces/actions";
import { Training } from "./types";
import * as trainingService from "./services";
import { responseHelper } from "@/lib/response";
import { TrainingProgram } from "./types";
import { Identifier } from "@/interfaces/entities";

export const getTrainingListAction: ServerAction<
  [PaginationParams],
  PaginatedResult<Training>
> = async (paginationParams) => {
  const trainingList = await trainingService.getTrainingList(paginationParams);

  return responseHelper.success(trainingList);
};

export const getTrainingProgramList: ServerAction<
  [Identifier],
  TrainingProgram[]
> = async (trainingId) => {
  const program = await trainingService.getTrainingProgram(trainingId);

  return responseHelper.success(program);
};
