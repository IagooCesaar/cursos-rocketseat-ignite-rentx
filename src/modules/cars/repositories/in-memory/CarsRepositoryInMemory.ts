import { ICreateCarDTO } from "@modules/cars/dtos/ICreateCarDTO";
import { Car } from "@modules/cars/infra/typeorm/entities/Car";

import { ICarsRepository } from "../ICarsRepository";

class CarsRepositoryInMemory implements ICarsRepository {
  cars: Car[] = [];

  async create({
    id,
    brand,
    category_id,
    daily_rate,
    description,
    fine_amount,
    license_plate,
    name,
    specifications,
  }: ICreateCarDTO): Promise<Car> {
    const car = new Car();
    Object.assign(car, {
      id: id || car.id,
      brand,
      category_id,
      daily_rate,
      description,
      fine_amount,
      license_plate,
      name,
      specifications,
    });
    this.cars.push(car);
    return car;
  }

  async findById(id: string): Promise<Car> {
    return this.cars.find((car) => car.id === id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    return this.cars.find((car) => car.license_plate === license_plate);
  }

  async findAvailable(
    brand?: string,
    category_id?: string,
    name?: string
  ): Promise<Car[]> {
    return this.cars.filter((car) => {
      if (
        car.available === true &&
        (brand ? car.brand === brand : true) &&
        (name ? car.name === name : true) &&
        (category_id ? car.category_id === category_id : true)
      ) {
        return car;
      }
      return null;
    });
  }

  async updateAvailability(
    car_id: string,
    availability: boolean
  ): Promise<void> {
    const carIndex = this.cars.findIndex((car) => car.id === car_id);
    this.cars[carIndex].available = availability;
  }
}

export { CarsRepositoryInMemory };
