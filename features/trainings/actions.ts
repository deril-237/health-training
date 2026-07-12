"use server";

import { PaginationParams } from "@/lib/pagination";
import * as trainingService from "./services";
import { Identifier } from "@/interfaces/entities";
import { action } from "@/lib/callAction";

export const getTrainingListAction = action(
  async (paginationParams: PaginationParams) => {
    const trainingList =
      await trainingService.getTrainingList(paginationParams);

    return trainingList;
  },
);

export const getTrainingProgramList = action(async (trainingId: Identifier) => {
  const program = await trainingService.getTrainingProgram(trainingId);

  return program;
});
