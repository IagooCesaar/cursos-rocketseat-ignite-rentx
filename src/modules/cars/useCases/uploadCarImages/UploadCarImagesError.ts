import { AppError } from "@shared/errors/appError";

export class UploadCarImageError extends AppError {
  constructor() {
    super("Car not found");
  }
}
