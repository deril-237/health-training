import { APIResponse } from "@/interfaces/response";
import { ActionError } from "@/lib/errors/ActionError";

export async function callAction<
  TData,
  TError extends {} = {},
  TArgs extends unknown[] = unknown[],
>(
  action: (...args: TArgs) => Promise<APIResponse<TData, TError>>,
  ...args: TArgs
): Promise<TData> {
  const result = await action(...args);

  if (result.success === false) {
    console.error(
      `Action failed with status code ${result.statusCode}: ${result.message}`,
      result.error,
    );
    throw new ActionError<TError>(result.statusCode, result.error);
  }

  return result.data;
}
