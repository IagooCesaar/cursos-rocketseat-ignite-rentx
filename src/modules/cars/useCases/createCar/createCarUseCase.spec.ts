import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { CreateCarError } from "./CreateCarError";
import { CreateCarUseCase } from "./createCarUseCase";

let createCarUseCase: CreateCarUseCase;
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

describe("Create car use case", () => {
  beforeEach(() => {
    carsRepositoryInMemory = new CarsRepositoryInMemory();
    createCarUseCase = new CreateCarUseCase(carsRepositoryInMemory);
  });

  it("Should be able to create a new car", async () => {
    const car = await createCarUseCase.execute(mockCar);
    expect(car).toHaveProperty("id");
  });

  it("Should be able to create a new car as available by default", async () => {
    const car = await createCarUseCase.execute(mockCar);
    expect(car.available).toBe(true);
  });

  it("Should not be able to create with license_plate already in use", async () => {
    await createCarUseCase.execute(mockCar);

    await expect(createCarUseCase.execute(mockCar)).rejects.toBeInstanceOf(
      CreateCarError
    );
  });
});
