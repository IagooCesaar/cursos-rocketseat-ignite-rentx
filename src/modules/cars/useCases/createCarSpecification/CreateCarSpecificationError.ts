/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable max-classes-per-file */
import { AppError } from "@shared/errors/appError";

export namespace CreateCarSpecificationError {
  export class CarNotFound extends AppError {
    constructor() {
      super("Car not found");
    }
  }

  export class SpecificationNotFound extends AppError {
    constructor() {
      super("Specification not found");
    }
  }
}
