import { inject, injectable } from "tsyringe";

import { Car } from "@modules/cars/infra/typeorm/entities/Car";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { ISpecificationsRepository } from "@modules/cars/repositories/ISpecificationsRepository";

import { CreateCarSpecificationError } from "./CreateCarSpecificationError";

interface IRequest {
  car_id: string;
  specifications_ids: string[];
}

@injectable()
class CreateCarSpecificationUseCase {
  constructor(
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("SpecificationsRepository")
    private specificationRepository: ISpecificationsRepository
  ) {}

  async execute({ car_id, specifications_ids }: IRequest): Promise<Car> {
    const car = await this.carsRepository.findById(car_id);
    if (!car) {
      throw new CreateCarSpecificationError.CarNotFound();
    }

    const specifications = await this.specificationRepository.findByIds(
      specifications_ids
    );
    if (specifications.length === 0) {
      throw new CreateCarSpecificationError.SpecificationNotFound();
    }

    car.specifications = specifications;
    await this.carsRepository.create(car);
    return car;
  }
}

export { CreateCarSpecificationUseCase };
