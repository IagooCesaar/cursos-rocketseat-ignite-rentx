import { Request, Response } from "express";
import { container } from "tsyringe";

import { ListAvailableCarsUseCase } from "./ListAvailableCarsUseCase";

class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, brand, category_id } = request.query;

    const listAvailableCars = container.resolve(ListAvailableCarsUseCase);
    const cars = await listAvailableCars.execute({
      category_id: category_id as string,
      brand: brand as string,
      name: name as string,
    });

    return response.status(200).json(cars);
  }
}

export { ListAvailableCarsController };
