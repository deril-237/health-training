export class AppError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class InternalError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

export class ConflictError<T> extends AppError {
  constructor(public fieldError: Partial<Record<keyof T, string>>) {
    super("conflict error");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends AppError {
  constructor(public fieldErrors: Record<string, string>) {
    super("validation error");
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message);
  }
}
