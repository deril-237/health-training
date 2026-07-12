import { FieldPath, FieldValues, UseFormSetError } from "react-hook-form";
import { AppError, ConflictError } from "@/lib/errors/appError";
import { ActionError } from "@/interfaces/actions";

type ApplyActionErrorsOptions = {
  onUnhandledError?: (message: string, error: AppError) => void;
};

export function applyActionErrors<TFieldValues extends FieldValues>(
  error: ActionError["error"],
  setError: UseFormSetError<TFieldValues>,
  options?: ApplyActionErrorsOptions,
) {
  if (error.code === "CONFLICT" && error.fieldsErrors) {
    Object.entries(error.fieldsErrors).forEach(([field, message]) => {
      if (typeof message !== "string") return;

      setError(field as FieldPath<TFieldValues>, {
        type: "server",
        message,
      });
    });

    if (error.global) {
      setError("root", {
        type: "server",
        message: error.global,
      });
    }

    return true;
  }

  if (!(error instanceof AppError)) {
    console.log(typeof error);
    setError("root", {
      message: "Une erreur est survenue pendant le traitement",
    });
    return;
  }

  if (options?.onUnhandledError) {
    options.onUnhandledError(error.message, error);
  } else {
    setError("root", {
      type: "server",
      message: error.message,
    });
  }

  return true;
}
