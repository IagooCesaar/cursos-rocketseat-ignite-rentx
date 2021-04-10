import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/appError";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,

    @inject("CarsRepository")
    private carsRepository: ICarsRepository,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({
    car_id,
    expected_return_date,
    user_id,
  }: IRequest): Promise<Rental> {
    const car = await this.carsRepository.findById(car_id);
    if (!car) {
      throw new AppError("Car not found");
    }

    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError("User not found");
    }

    const carIsUnavailable = await this.rentalsRepository.findOpenRentalByCar(
      car_id
    );
    if (carIsUnavailable) {
      throw new AppError("Car is not available");
    }

    const userOccupied = await this.rentalsRepository.findOpenRentalByUser(
      user_id
    );
    if (userOccupied) {
      throw new AppError("There's a rental is progress for user");
    }

    const compare = this.dateProvider.compareInHours(
      this.dateProvider.dateNow(),
      expected_return_date
    );
    const rentalMinDurationHours = 24;

    if (compare < rentalMinDurationHours) {
      throw new AppError(
        `A rental must have at least ${rentalMinDurationHours} hours of duration`
      );
    }

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    await this.carsRepository.updateAvailability(car_id, false);

    return rental;
  }
}

export { CreateRentalUseCase };
