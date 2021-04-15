import { AppError } from "@shared/errors/appError";

class SendForgotPasswordMailError extends AppError {
  constructor() {
    super("User not found");
  }
}

export { SendForgotPasswordMailError };
