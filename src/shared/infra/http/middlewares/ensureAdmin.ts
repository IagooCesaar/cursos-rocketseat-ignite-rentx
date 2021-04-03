import { NextFunction, Request, Response } from "express";

import { UsersRepository } from "@modules/accounts/infra/repositories/UsersRepository";
import { AppError } from "@shared/errors/appError";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { id } = request.user;

  const usersRepository = new UsersRepository();
  const user = await usersRepository.findById(id);

  if (!user.isAdmin) {
    throw new AppError("User does not have admin privileges");
  }
  next();
}
