import {
  AppError,
  InternalError,
  ConflictError,
  NotFoundError,
  ValidationError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from "./appError";
import { ActionError } from "@/interfaces/actions";
import { responseHelper } from "@/lib/response";

export function resolverError<T extends {} = {}>(
  error: unknown,
): ActionError<T> {
  if (error instanceof ValidationError) {
    return responseHelper.error<T>({
      statusCode: "VALIDATION",
      error: {
        global: "Validation failed",
        fieldsErrors: error.fieldErrors as Record<keyof T, string>,
      },
    });
  }

  if (error instanceof BadRequestError) {
    return responseHelper.error({
      statusCode: "BAD_REQUEST",
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof UnauthorizedError) {
    return responseHelper.error({
      statusCode: "UNAUTHORIZE",
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof ForbiddenError) {
    return responseHelper.error({
      statusCode: "FORBIDDEN",
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof ConflictError) {
    return responseHelper.error({
      statusCode: "CONFLICT",
      error: {
        global: error.global,
        fieldsErrors: error.fieldError,
      },
    });
  }

  if (error instanceof NotFoundError) {
    return responseHelper.error({
      statusCode: "NOT_FOUND",
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof InternalError) {
    return responseHelper.error({
      statusCode: "INTERNAL_ERROR",
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof AppError) {
    return responseHelper.error({
      statusCode: "INTERNAL_ERROR",
      error: {
        global: error.message,
      },
    });
  }

  // Gestion des erreurs non typées
  return responseHelper.error({
    statusCode: "INTERNAL_ERROR",
    error: {
      global: "An unexpected error occurred",
      details: error instanceof Error ? error.message : String(error),
    },
  });
}
