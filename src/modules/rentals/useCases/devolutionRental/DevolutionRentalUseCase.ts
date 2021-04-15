import { inject, injectable } from "tsyringe";

import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

import { DevolutionRentalError } from "./DevolutionRentalError";

interface IRequest {
  id: string;
  user_id: string;
}

@injectable()
class DevolutionRentalUseCase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,

    @inject("CarsRepository")
    private carsRepository: ICarsRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider
  ) {}

  async execute({ id, user_id }: IRequest): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    if (!rental) {
      throw new DevolutionRentalError();
    }
    const car = await this.carsRepository.findById(rental.car_id);

    const dateNow = this.dateProvider.dateNow();
    const minDaily = 1;
    let total = 0;

    let daily = this.dateProvider.compareInDays(rental.start_date, dateNow);
    if (daily <= 0) daily = minDaily;

    const delay = this.dateProvider.compareInDays(
      dateNow,
      rental.expected_return_date
    );

    if (delay > 0) {
      const totalFineAmount = delay * car.fine_amount;
      total += totalFineAmount;
    }

    total += daily * car.daily_rate;

    rental.end_date = dateNow;
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailability(car.id, true);

    return rental;
  }
}

export { DevolutionRentalUseCase };
