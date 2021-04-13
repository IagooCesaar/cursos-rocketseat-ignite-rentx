import { AppError } from "@shared/errors/appError";

class CreateCarError extends AppError {
  constructor() {
    super("Car already exists");
  }
}

export { CreateCarError };
