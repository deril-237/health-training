import { Prisma } from "../generated/prisma/client";
import { ConflictError, InternalError, NotFoundError } from "./appError";

export const prismaErrorcode = {
  unique: "P2002",
  foreignKey: "P2003",
  notExist: "P2025",
};

type ErrorMap<Key extends string = string> = {
  unique?: Partial<Record<Key, string>>;
  foreignKey?: Partial<Record<Key, string>>;
  notExist?: string;
  internalError?: string;
};

export function handlePrismaError<T extends string = string>(
  error: unknown,
  errorsMessage: ErrorMap<T>,
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
