import { ApiError, ApiSuccess, ErrorBody } from "@/interfaces/response";

type ErrorParams<T extends {} = {}> = {
  statusCode: number;
  message?: string;
  error?: ErrorBody<T>;
};

export const responseHelper = {
  success<T>(data: T, statusCode = 200, message?: string): ApiSuccess<T> {
    return { success: true, data, statusCode, message };
  },

  error<T extends {} = {}>({
    statusCode,
    error,
    message,
  }: ErrorParams<T>): ApiError<T> {
    return { success: false, statusCode, error, message };
  },
};
