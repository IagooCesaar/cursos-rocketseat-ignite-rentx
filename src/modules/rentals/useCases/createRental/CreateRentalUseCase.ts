import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/infra/typeorm/repositories/IRentalsRepository";
import { AppError } from "@shared/errors/appError";

interface IRequest {
  user_id: string;
  car_id: string;
  expected_return_date: Date;
}

class CreateRentalUseCase {
  constructor(
    private rentalsRepository: IRentalsRepository,
    private carsRepository: ICarsRepository,
    private usersRepository: IUsersRepository
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

    const rental = await this.rentalsRepository.create({
      user_id,
      car_id,
      expected_return_date,
    });

    return rental;
  }
}

export { CreateRentalUseCase };
