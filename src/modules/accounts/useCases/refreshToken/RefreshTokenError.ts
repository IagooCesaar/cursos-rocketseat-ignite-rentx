import { AppError } from "@shared/errors/appError";

class RefreshTokenError extends AppError {
  constructor() {
    super("Refresh token does not exists!");
  }
}

export { RefreshTokenError };
