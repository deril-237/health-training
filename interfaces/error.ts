export type CodeError =
  | "CONFLICT"
  | "VALIDATION"
  | "INTERNAL_ERROR"
  | "NOT_FOUND"
  | "BAD_REQUEST"
  | "UNAUTHORIZE"
  | "FORBIDDEN";

export type ErrorBody<T extends {} = {}> = {
  global?: string;
  fieldsErrors?: Partial<Record<keyof T, string>>;
  details?: unknown;
};
