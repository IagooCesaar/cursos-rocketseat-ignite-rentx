import { AppError } from "@shared/errors/appError";

class DevolutionRentalError extends AppError {
  constructor() {
    super("Rental does not exists");
  }
}

export { DevolutionRentalError };
