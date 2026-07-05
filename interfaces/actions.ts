import { APIResponse } from "./response";

export type ServerAction<
  TArgs extends unknown[] = unknown[],
  TData = unknown,
  TError extends {} = {},
> = (...args: TArgs) => Promise<APIResponse<TData, TError>>;
