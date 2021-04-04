import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

let listCarsUseCase: ListAvailableCarsUseCase;
let carsRepository: CarsRepositoryInMemory;

const mockCar = {
  name: "Car Name",
  description: "Description",
  daily_rate: 100,
  license_plate: "ABC-1234",
  fine_amount: 60,
  brand: "Brand",
  category_id: "12345",
};

describe("List Cars", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    listCarsUseCase = new ListAvailableCarsUseCase(carsRepository);
  });

  it("Should be able to list all available cars", async () => {
    const createdCar = await carsRepository.create(mockCar);

    const cars = await listCarsUseCase.execute({});

    expect(cars).toStrictEqual([createdCar]);
  });

  it("Should be able to list all available cars by name", async () => {
    const createdCar = await carsRepository.create(mockCar);
    await carsRepository.create({
      ...mockCar,
      name: "another name",
    });

    const cars = await listCarsUseCase.execute({ name: createdCar.name });
    expect(cars).toHaveLength(1);
  });

  it("Should be able to list all available cars by brand", async () => {
    const createdCar = await carsRepository.create(mockCar);
    await carsRepository.create({
      ...mockCar,
      brand: "another brand",
    });

    const cars = await listCarsUseCase.execute({ brand: createdCar.brand });
    expect(cars).toHaveLength(1);
  });

  it("Should be able to list all available cars by category_id", async () => {
    const createdCar = await carsRepository.create(mockCar);
    await carsRepository.create({
      ...mockCar,
      category_id: "54321",
    });

    const cars = await listCarsUseCase.execute({
      category_id: createdCar.category_id,
    });
    expect(cars).toHaveLength(1);
  });
});
