import zod from "zod";

export const createWaveSchema = zod.object({
  startDate: zod.coerce.date().min(Date.now()),
  quota: zod.coerce.number().int().min(1),
  price: zod.coerce.number().min(0),
  trainingProgramId: zod.cuid2(),
});

export type CreateWaveInput = zod.infer<typeof createWaveSchema>;

export const updateWaveSchema = zod
  .object({
    startDate: zod.date().min(Date.now()),
    quota: zod.coerce.number().int().min(1),
    price: zod.coerce.number().min(0),
  })
  .partial();

export type UpdateWaveInput = zod.infer<typeof updateWaveSchema>;
