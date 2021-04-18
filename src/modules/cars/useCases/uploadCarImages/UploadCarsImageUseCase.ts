import { inject, injectable } from "tsyringe";

import { CarsImagesRepository } from "@modules/cars/infra/typeorm/repositories/CarsImagesRepository";
import { CarsRepository } from "@modules/cars/infra/typeorm/repositories/CarsRepository";
import { IStorageProvider } from "@shared/container/providers/StorageProvider/IStorageProvider";

import { UploadCarImageError } from "./UploadCarImagesError";

interface IRequest {
  car_id: string;
  images_name: string[];
}

@injectable()
class UploadCarImagesUseCase {
  constructor(
    @inject("CarsImagesRepository")
    private carsImagesRepository: CarsImagesRepository,

    @inject("CarsRepository")
    private carsRepository: CarsRepository,

    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  async execute({ car_id, images_name }: IRequest): Promise<void> {
    const car = await this.carsRepository.findById(car_id);
    if (!car) {
      throw new UploadCarImageError();
    }

    images_name.map(async (image) => {
      await this.carsImagesRepository.create(car_id, image);
      await this.storageProvider.save(image, "cars");
    });
  }
}

export { UploadCarImagesUseCase };
