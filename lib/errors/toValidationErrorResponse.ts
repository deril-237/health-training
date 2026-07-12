import { ErrorState } from "@/lib/form";
import { responseHelper } from "@/lib/response";
import { ApiError } from "@/interfaces/response";

export function toValidationErrorResponse<T extends {}>(
  errors: ErrorState<T>["errors"],
): ApiError<T> {
  return responseHelper.error({
    statusCode: "VALIDATION",
    error: {
      global: errors.global ?? "Validation failed",
      fieldsErrors: errors.fieldsErrors,
    },
  });
}
