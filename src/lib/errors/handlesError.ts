"server-only";

import { APIError } from "better-auth";
import { Prisma } from "../generated/prisma/client";

import {
  AppError,
  ConflictError,
  ForbiddenError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
} from "./appError";

export const prismaErrorCode = {
  unique: "P2002",
  foreignKey: "P2003",
  notExist: "P2025",
} as const;

type ErrorMap<Key extends string = string> = {
  unique?: {
    fields?: Partial<Record<Key, string[]>>;
    global?: string;
  };

  foreignKey?: Partial<Record<Key, string>>;

  notExist?: string;

  internalError?: string;
};

export function handlePrismaError<T extends string = string>(
  error: unknown,
  errorsMessage: ErrorMap<T>,
): never {
  if (error instanceof AppError) {
    throw error;
  }

  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) {
    throw new InternalError(
      errorsMessage.internalError ??
        "Une erreur est survenue pendant l'opération.",
    );
  }

  if (error.code === prismaErrorCode.unique) {
    const target = error.meta?.target as string[] | string | undefined;

    const fields = Array.isArray(target) ? target : target ? [target] : [];

    const fieldErrors: Partial<Record<T, string[]>> = {};

    for (const field of fields) {
      const message = errorsMessage.unique?.fields?.[field as T];

      if (message) {
        fieldErrors[field as T] = message;
      }
    }

    throw new ConflictError<T>(
      fieldErrors,
      errorsMessage.unique?.global ?? "Une donnée existe déjà.",
    );
  }

  if (error.code === prismaErrorCode.notExist) {
    throw new NotFoundError(errorsMessage.notExist ?? "Ressource introuvable.");
  }

  // if (error.code === prismaErrorCode.foreignKey) {
  //   const fieldName = error.meta?.field_name as string | undefined;

  //   const key = Object.keys(errorsMessage.foreignKey ?? {}).find((k) =>
  //     fieldName?.includes(k),
  //   ) as T | undefined;

  //   throw new ConflictError<T>(
  //     {},
  //     key
  //       ? errorsMessage.foreignKey?.[key]
  //       : "Cette opération viole une contrainte.",
  //   );
  // }

  throw new InternalError("Erreur liée à la base de données.");
}

export function handleBetterAuthError(
  error: unknown,
  messages?: Partial<Record<APIError["status"], string>> & {
    internal?: string;
  },
): never {
  if (!(error instanceof APIError)) {
    throw error;
  }

  const message = messages
    ? messages[error.status]
    : "Une erreur est survenue lors du traitement";
  switch (error.status) {
    case "UNAUTHORIZED":
      throw new UnauthorizedError(message);
    case "FORBIDDEN":
      throw new ForbiddenError(message);
    case "TOO_MANY_REQUESTS":
      throw new UnauthorizedError(message);
    case "BAD_REQUEST":
      throw new UnauthorizedError(message);
    default:
      throw new InternalError(message);
  }
}
