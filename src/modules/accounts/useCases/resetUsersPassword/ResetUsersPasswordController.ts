import { Request, Response } from "express";
import { container } from "tsyringe";

import { ResetUsersPasswordUseCase } from "./ResetUsersPasswordUseCase";

class ResetUsersPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;

    const resetUsersPasswordUseCase = container.resolve(
      ResetUsersPasswordUseCase
    );
    await resetUsersPasswordUseCase.execute({ token: String(token), password });
    return response.status(200).send();
  }
}

export { ResetUsersPasswordController };
