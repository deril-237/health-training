import { dateInput } from "@/lib/zodRules";
import zod from "zod";
import { ModalityOption } from "./types";

export const inscriptionSchema = zod.object({
  numCNIPassport: zod
    .string()
    .regex(/^[A-Z0-9][A-Z-0-9]{3, }+$/)
    .trim(),
  name: zod
    .string()
    .regex(/^[A-Za-z][A-Za-z0-9\S+]]{3, }$/)
    .trim()
    .refine((value) => value.replace(/\S+$/, " ")),
  secondName: zod
    .string()
    .regex(/^[A-Za-z][A-Za-z0-9\S+]]{3, }$/)
    .trim()
    .refine((value) => value.replace(/\S+/, " ")),
  birthDate: dateInput("La date naissance requise", "date invalid"),
  birthPlace: zod.string().regex(/^[A-Za-z][A-Za-z0-9\S+\-]{3, }$/),
  email: zod.email(),
  residence: zod.string().regex(/^[A-Za-z][A-Za-z0-9]$/),
  diploma: zod.file().mime(["application/pdf"]).max(4),
  photo: zod.file().mime(["image/jpeg", "image/png"]).max(4),
  cniPassport: zod.file().mime(["application/pdf"]).max(4),
  motivations: zod.array(zod.string()),
  otherMotivation: zod.string().optional(),
  trainingProgramId: zod.cuid2(),
  modality: zod.enum([ModalityOption.OFF_LINE, ModalityOption.ON_LINE]),
});

export type InscriptionInput = zod.infer<typeof inscriptionSchema>;
