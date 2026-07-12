import { Identifier } from "@/interfaces/entities";
import { WaveStatus, Wave } from "@/lib/generated/prisma/client";
import { PaginatedResult } from "@/lib/pagination";

export { type Wave, type WaveStatus } from "@/lib/generated/prisma/client";

export type FilterWave = {
  trainingProgramId?: Identifier;
  status?: WaveStatus;
};

export type WaveList = PaginatedResult<Wave>;
