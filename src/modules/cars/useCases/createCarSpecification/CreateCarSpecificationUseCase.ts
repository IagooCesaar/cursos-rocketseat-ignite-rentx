import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { AppError } from "@shared/errors/appError";

interface IRequest {
  car_id: string;
  specifications_ids: string[];
}

class CreateCarSpecificationUseCase {
  constructor(private carsRepository: ICarsRepository) {}

  async execute({ car_id, specifications_ids }: IRequest): Promise<void> {
    const car = this.carsRepository.findById(car_id);
    if (!car) {
      throw new AppError("Car does not exists");
    }
  }
}

export { CreateCarSpecificationUseCase };
