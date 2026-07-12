import { CodeError, ErrorBody } from "./error";
import { APIResponse } from "./response";

export type ServerAction<
  TArgs extends unknown[] = unknown[],
  TData = unknown,
  TError extends {} = {},
> = (...args: TArgs) => Promise<APIResponse<TData, TError>>;

export type ActionSuccess<T> = {
  success: true;
  data: T;
};

export type ActionError<T extends {} = {}> = {
  success: false;
  error: ErrorBody<T> & { code: CodeError };
};

export type ActionResult<T, E extends {}> = ActionSuccess<T> | ActionError<E>;
