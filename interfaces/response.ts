export type ErrorBody<T extends {} = {}> = {
  global?: string;
  fieldsErrors?: Partial<Record<keyof T, string>>;
  details?: unknown;
};

export interface ApiSuccess<TData = unknown> {
  success: true;
  statusCode: number;
  message?: string;
  data: TData;
  error?: never;
}

export interface ApiError<TError extends {} = {}> {
  success: false;
  statusCode: number;
  message?: string;
  data?: never;
  error?: ErrorBody<TError>;
}

export type APIResponse<TData = unknown, TError extends {} = {}> =
  | ApiSuccess<TData>
  | ApiError<TError>;
