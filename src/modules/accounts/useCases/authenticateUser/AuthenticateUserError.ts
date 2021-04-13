import { AppError } from "@shared/errors/appError";

class AuthenticateUserError extends AppError {
  constructor() {
    super("Email or password incorrect");
  }
}

export { AuthenticateUserError };
