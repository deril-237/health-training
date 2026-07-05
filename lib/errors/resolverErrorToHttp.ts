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
import { ApiError } from "@/interfaces/response";
import { responseHelper } from "@/lib/response";

export function resolverErrorToHttp<T extends {} = {}>(
  error: unknown,
): ApiError {
  if (error instanceof ValidationError) {
    return responseHelper.error({
      statusCode: 400,
      error: {
        global: "Validation failed",
        fieldsErrors: error.fieldErrors,
      },
    });
  }

  if (error instanceof BadRequestError) {
    return responseHelper.error({
      statusCode: 400,
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof UnauthorizedError) {
    return responseHelper.error({
      statusCode: 401,
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof ForbiddenError) {
    return responseHelper.error({
      statusCode: 403,
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof ConflictError) {
    return responseHelper.error({
      statusCode: 409,
      error: {
        global: "Conflict",
        fieldsErrors: error.fieldError as Record<string, string>,
      },
    });
  }

  if (error instanceof NotFoundError) {
    return responseHelper.error({
      statusCode: 404,
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof InternalError) {
    return responseHelper.error({
      statusCode: 500,
      error: {
        global: error.message,
      },
    });
  }

  if (error instanceof AppError) {
    return responseHelper.error({
      statusCode: 500,
      error: {
        global: error.message,
      },
    });
  }

  // Gestion des erreurs non typées
  return responseHelper.error({
    statusCode: 500,
    error: {
      global: "An unexpected error occurred",
      details: error instanceof Error ? error.message : String(error),
    },
  });
}
