/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { AppError } from "@shared/errors/appError";

export namespace ResetUsersPasswordError {
  export class TokenInvalid extends AppError {
    constructor() {
      super("Token invalid!");
    }
  }

  export class TokenExpired extends AppError {
    constructor() {
      super("Token expired!");
    }
  }
}
