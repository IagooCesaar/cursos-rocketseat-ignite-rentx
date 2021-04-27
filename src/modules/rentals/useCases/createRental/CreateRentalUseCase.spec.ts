import dayjs from "dayjs";

import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";

import { CreateRentalError } from "./CreateRentalError";
import { CreateRentalUseCase } from "./CreateRentalUseCase";

let createRentalUseCase: CreateRentalUseCase;
let carsRepository: CarsRepositoryInMemory;
let usersRepository: UsersRepositoryInMemory;
let rentalsRepository: RentalsRepositoryInMemory;
let dateProvider: DayjsDateProvider;

const mockCar = {
  name: "Car Name",
  description: "Description",
  daily_rate: 100,
  license_plate: "ABC-1234",
  fine_amount: 60,
  brand: "Brand",
  category_id: "Category",
};

const mockUser = {
  name: "Iago",
  email: "iagocesar.sgs@gmail.com",
  password: "1234",
  driver_license: "123456",
};

const dayAdd24hours = dayjs().add(25, "hours").toDate();

describe("Create Rental Use Case", () => {
  beforeEach(() => {
    carsRepository = new CarsRepositoryInMemory();
    usersRepository = new UsersRepositoryInMemory();
    rentalsRepository = new RentalsRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      rentalsRepository,
      carsRepository,
      usersRepository,
      dateProvider
    );
  });

  it("Should be able to create a new rental", async () => {
    const user = await usersRepository.create(mockUser);
    const car = await carsRepository.create(mockCar);

    const rental = await createRentalUseCase.execute({
      user_id: user.id,
      car_id: car.id,
      expected_return_date: dayAdd24hours,
    });

    expect(rental).toHaveProperty("id");
  });

  it("Should not be able to create a new rental if has another opened to the same user", async () => {
    const user = await usersRepository.create(mockUser);

    const car1 = await carsRepository.create(mockCar);
    mockCar.name = "another";
    const car2 = await carsRepository.create(mockCar);

    await carsRepository.findAvailable();

    await createRentalUseCase.execute({
      user_id: user.id,
      car_id: car1.id,
      expected_return_date: dayAdd24hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: user.id,
        car_id: car2.id,
        expected_return_date: dayAdd24hours,
      })
    ).rejects.toBeInstanceOf(CreateRentalError.UserWithRentalInProgress);
  });

  it("Should not be able to create a new rental if has another opened to the same car", async () => {
    const user1 = await usersRepository.create(mockUser);
    mockUser.name = "another user";
    const user2 = await usersRepository.create(mockUser);

    const car = await carsRepository.create(mockCar);

    await createRentalUseCase.execute({
      user_id: user1.id,
      car_id: car.id,
      expected_return_date: dayAdd24hours,
    });

    await expect(
      createRentalUseCase.execute({
        user_id: user2.id,
        car_id: car.id,
        expected_return_date: dayAdd24hours,
      })
    ).rejects.toBeInstanceOf(CreateRentalError.CarNotAvailable);
  });

  it("Should not be able to create a new rental with duration less then 24 hours", async () => {
    const user = await usersRepository.create(mockUser);
    const car = await carsRepository.create(mockCar);

    await expect(
      createRentalUseCase.execute({
        user_id: user.id,
        car_id: car.id,
        expected_return_date: new Date(),
      })
    ).rejects.toBeInstanceOf(CreateRentalError.DurationLessThenMinimum);
  });
});
