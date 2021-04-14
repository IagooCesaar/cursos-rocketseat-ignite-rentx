import { AppError } from "@shared/errors/appError";

class CreateCategoryError extends AppError {
  constructor() {
    super("Category already exists");
  }
}

export { CreateCategoryError };
