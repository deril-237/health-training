import { Identifier } from "@/interfaces/entities";
import { Inscription } from "@/lib/generated/prisma/client";

export { ModalityOption, type Student } from "@/lib/generated/prisma/client";

export type FilterStudent = { waveId?: Identifier; search?: string };
export type SecondEnrollStudent = Pick<
  Inscription,
  "studentId" | "modality"
> & { trainingProgramId: Identifier };
