import { AppError } from "@shared/errors/appError";

class CreateUserError extends AppError {
  constructor() {
    super("User already exists");
  }
}

export { CreateUserError };
