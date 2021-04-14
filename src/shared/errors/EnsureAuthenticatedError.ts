/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { AppError } from "./appError";

export namespace EnsureAuthenticatedError {
  export class UserNotExists extends AppError {
    constructor() {
      super("User does not exists", 401);
    }
  }

  export class InvalidToken extends AppError {
    constructor() {
      super("Invalid token", 401);
    }
  }

  export class TokenMissing extends AppError {
    constructor() {
      super("Token missing", 401);
    }
  }
}
