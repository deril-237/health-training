import { numericInput } from "@/lib/zodRules";
import zod, { z } from "zod";

const baseSchema = zod.object({
  startDate: zod.coerce
    .date({ error: "La date de début est requise" })
    .min(Date.now(), {
      error: "La date doit supérieure à celle d'aujourd'huit",
    })
    .nonoptional({ error: "La date est requise" }),
  quota: numericInput(
    "Le quota est requis",
    "Le nombre d'etudiant doit etre un nombre",
  ).pipe(
    z
      .number()
      .int({ error: "Le quota d'etudiant doit etre un entier" })
      .min(1, { error: "Le quota doit etre egale ou supérieure à 1" }),
  ),
  price: numericInput(
    "Le prix de la vagie est requis",
    "Le prix doit etre un nombre",
  ).pipe(
    z
      .number()
      // .int({ error: "doit etre un entier" })
      .positive({ error: "Le prix doit etre un nombre positf" }),
  ),
});

export const createWaveSchema = baseSchema.extend({
  trainingProgramId: zod.cuid2({
    error: (issue) => {
      if (
        issue.input === undefined ||
        issue.input === "" ||
        issue.input === null
      ) {
        return "Choisez un parcour";
      }

      return "parcours invalid";
    },
  }),
});

export type CreateWaveInput = zod.infer<typeof createWaveSchema>;

export const updateWaveSchema = baseSchema.partial();

export type UpdateWaveInput = zod.infer<typeof updateWaveSchema>;
