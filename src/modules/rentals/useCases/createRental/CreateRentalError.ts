/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { AppError } from "@shared/errors/appError";

export namespace CreateRentalError {
  export class CarNotFound extends AppError {
    constructor() {
      super("Car not found");
    }
  }

  export class UserNotFound extends AppError {
    constructor() {
      super("User not found");
    }
  }

  export class CarNotAvailable extends AppError {
    constructor() {
      super("Car is not available");
    }
  }

  export class UserWithRentalInProgress extends AppError {
    constructor() {
      super("There's a rental is progress for user");
    }
  }

  export class DurationLessThenMinimum extends AppError {
    constructor(rentalMinDurationHours: number) {
      super(
        `A rental must have at least ${rentalMinDurationHours} hours of duration`
      );
    }
  }
}
