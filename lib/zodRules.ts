import { z } from "zod";

export const numericInput = (required: string, invalid: string) =>
  z.preprocess(
    (value) => {
      if (typeof value === "number") {
        return value.toString();
      }

      return value;
    },
    z
      .string({
        error: (issue) => {
          if (issue.input === undefined) {
            return required;
          }

          return invalid;
        },
      })
      .trim()
      .min(1, { error: required })
      .refine((value) => !Number.isNaN(Number(value)), {
        error: invalid,
      })
      .transform(Number),
  );

export const dateInput = (
  requiredMessage: string,
  invalidMessage = "Veuillez entrer une date valide",
) =>
  z
    .string({
      error: (issue) => {
        if (issue.input === undefined) {
          return requiredMessage;
        }

        return invalidMessage;
      },
    })
    .trim()
    .min(1, { error: requiredMessage })
    .transform((value, ctx) => {
      const date = new Date(value);

      if (Number.isNaN(date.getTime())) {
        ctx.addIssue({
          code: "custom",
          message: invalidMessage,
        });

        return z.NEVER;
      }

      return date;
    });

export const optionalDateInput = (
  invalidMessage = "Veuillez entrer une date valide",
) =>
  z.preprocess(
    (value) => {
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) {
        return undefined;
      }

      return value;
    },
    z
      .string({
        error: invalidMessage,
      })
      .transform((value, ctx) => {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
          ctx.addIssue({
            code: "custom",
            message: invalidMessage,
          });

          return z.NEVER;
        }

        return date;
      })
      .optional(),
  );
