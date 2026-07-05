"use server";

import { z } from "zod";

export type SuccessState<T = unknown> = {
  success: true;
  data: T;
};

export type ErrorState<T = unknown> = {
  success: false;
  errors: {
    global?: string;
    fieldsErrors?: Partial<Record<keyof T, string>>;
  };
  oldValue: unknown;
};

export type FormState<T = unknown, E = unknown> =
  | ErrorState<E>
  | SuccessState<T>;

type ValidateDataParams<T> = {
  formData: FormData | any;
  schema: z.ZodSchema<T>;
};

export async function validateData<T extends object>({
  formData,
  schema,
}: ValidateDataParams<T>): Promise<FormState<T, T>> {
  // Convert FormData -> object
  let values = {};

  if (formData instanceof FormData) {
    values = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, value]),
    );
  } else {
    values = formData;
  }

  // Validation
  const result = schema.safeParse(values);

  // Validation errors
  if (!result.success) {
    const errors = Object.fromEntries(
      result.error.issues.map((issue) => [
        issue.path[0] as keyof T,
        issue.message,
      ]),
    ) as Partial<Record<keyof T, string>>;

    return {
      success: false,
      errors: { fieldsErrors: errors },
      oldValue: values,
    };
  }

  // Success
  return {
    success: true,
    data: result.data,
  };
}
