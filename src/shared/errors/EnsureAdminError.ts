import { AppError } from "./appError";

class EnsureAdminError extends AppError {
  constructor() {
    super("User does not have admin privileges");
  }
}

export { EnsureAdminError };
