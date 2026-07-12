import { ActionError } from "@/interfaces/actions";
import { CodeError } from "@/interfaces/error";
import { ApiError, ApiSuccess, ErrorBody } from "@/interfaces/response";

type ErrorParams<T extends {} = {}> = {
  statusCode: CodeError;
  message?: string;
  error?: ErrorBody<T>;
};

export const responseHelper = {
  success<T>(data: T, message?: string): ApiSuccess<T> {
    return { success: true, data, message };
  },

  error<T extends {} = {}>({
    statusCode,
    error,
    message,
  }: ErrorParams<T>): ActionError<T> {
    return {
      success: false,
      error: { ...error, code: statusCode },
    };
  },
};
