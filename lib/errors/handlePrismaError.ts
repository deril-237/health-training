import { Prisma } from "../generated/prisma/client";
import { ConflictError, InternalError, NotFoundError } from "./appError";

export const prismaErrorcode = {
  unique: "P2002",
  foreignKey: "P2003",
  notExist: "P2025",
};

type ErrorMap = {
  unique?: Record<string, string>;
  foreignKey?: Record<string, string>;
  notExist?: string;
  internalError?: string;
};

export function handlePrismaError(
  error: unknown,
  errorsMessage: ErrorMap,
): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error);
    if (error.code === prismaErrorcode.unique) {
      throw new ConflictError(errorsMessage.unique ?? {});
    }

    if (error.code === prismaErrorcode.notExist) {
      throw new NotFoundError(
        errorsMessage.notExist ?? "ressource introuvable",
      );
    }
  }

  throw new InternalError(
    errorsMessage.internalError ?? "Il y a une erreur pendant l'operation",
  );
}
