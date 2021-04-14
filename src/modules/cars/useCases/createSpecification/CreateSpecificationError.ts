import { AppError } from "@shared/errors/appError";

class CreateSpecificationError extends AppError {
  constructor() {
    super("Specification already exists");
  }
}

export { CreateSpecificationError };
