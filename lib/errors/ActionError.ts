import { ErrorBody } from "@/interfaces/response";

export class ActionError<TError extends {} = {}> extends Error {
  public statusCode: number;
  public fieldsErrors?: ErrorBody<TError>["fieldsErrors"];
  public details?: unknown;

  constructor(statusCode: number, body?: ErrorBody<TError>) {
    super(
      "Une erreur est survenue lors de la création du programme. S'il vous plaît, réessayez plus tard ou contacté l'administrateur.",
    );
    this.name = "ActionError";
    this.statusCode = statusCode;
    this.fieldsErrors = body?.fieldsErrors;
    this.details = body?.details;
  }
}
