import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { SpecificationRepositoryInMemory } from "@modules/cars/repositories/in-memory/SpecificationsRepositoryInMemory";
import { AppError } from "@shared/errors/appError";

import { CreateCarSpecificationUseCase } from "./CreateCarSpecificationUseCase";

let createCarSpecificationUseCase: CreateCarSpecificationUseCase;
let carsRepositoryInMemory: CarsRepositoryInMemory;
let specificationRepositoryInMemory: SpecificationRepositoryInMemory;
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
    specificationRepositoryInMemory = new SpecificationRepositoryInMemory();
    createCarSpecificationUseCase = new CreateCarSpecificationUseCase(
      carsRepositoryInMemory,
      specificationRepositoryInMemory
    );
  });

  it("Should be able to add a new specification to a car", async () => {
    const specifications_ids = [];

    const car = await carsRepositoryInMemory.create(mockCar);

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i <= 1; i++) {
      specificationRepositoryInMemory
        .create({
          name: `Specification ${i + 1}`,
          description: `Specification Test ${i + 1}`,
        })
        .then((specification) => {
          specifications_ids.push(specification.id);
        });
    }

    const specificationsCars = await createCarSpecificationUseCase.execute({
      car_id: car.id,
      specifications_ids,
    });

    expect(specificationsCars.specifications).toHaveLength(2);
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

  it("Should not be able to add a inexistent specification to a car", async () => {
    expect(async () => {
      const car = await carsRepositoryInMemory.create(mockCar);
      const specifications_ids = ["456", "789"];

      await createCarSpecificationUseCase.execute({
        car_id: car.id,
        specifications_ids,
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
