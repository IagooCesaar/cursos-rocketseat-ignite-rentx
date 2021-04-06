import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { AppError } from "@shared/errors/appError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
const mockCar = {
  name: "Car Name",
  description: "Description",
  daily_rate: 100,
  license_plate: "ABC-1234",
  fine_amount: 60,
  brand: "Brand",
  category_id: "Category",
};

describe("Create Car Specification", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory
    );
  });

  it("Should be able to add a new specification to a car", async () => {
    const specifications_ids = ["456", "789"];

    const car = await carsRepositoryInMemory.create(mockCar);

    await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_ids,
    });
  });

  it("Should not be able to add a new specification to inexistent car", async () => {
    expect(async () => {
      const car_id = "123";
      const specifications_ids = ["456", "789"];

      await createCarSpecificationUseCase.execute({
        car_id,
        specifications_ids,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
