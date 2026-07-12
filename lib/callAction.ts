import { resolverError } from "./errors/resolverError";
import { ActionResult } from "@/interfaces/actions";
import { responseHelper } from "./response";

type Action<TData, TError extends {}, TArgs extends unknown[] = unknown[]> = (
  ...args: TArgs
) => Promise<ActionResult<TData, TError>>;

export function action<
  TData,
  TError extends {} = {},
  TArgs extends unknown[] = unknown[],
>(fn: (...args: TArgs) => Promise<TData>): Action<TData, TError, TArgs> {
  return async (...args: TArgs) => {
    try {
      const result = await fn(...args);
      return responseHelper.success(result);
    } catch (error) {
      console.log(error);
      const result = resolverError<TError>(error);
      return result;
    }
  };
}
