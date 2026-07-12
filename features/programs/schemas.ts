import zod from "zod";

export const createProgramSchema = zod.object({
  duration: zod.coerce
    .number<number>({ error: "Le nombre de mois est requis" })
    .int({ error: "Le nombre de mois doit être un entier" })
    .min(1, { error: "Le nombre de mois ne peut pas être inferieure à 1" }),
});

export type CreateProgramInput = zod.infer<typeof createProgramSchema>;

export const updateProgramSchema = createProgramSchema;

export type UpdateProgramInput = zod.infer<typeof updateProgramSchema>;
