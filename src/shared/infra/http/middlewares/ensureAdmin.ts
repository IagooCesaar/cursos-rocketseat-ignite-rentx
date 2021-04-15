import { NextFunction, Request, Response } from "express";

import { UsersRepository } from "@modules/accounts/infra/repositories/UsersRepository";
import { EnsureAdminError } from "@shared/errors/EnsureAdminError";

export async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { id } = request.user;

  const usersRepository = new UsersRepository();
  const user = await usersRepository.findById(id);

  if (!user.isAdmin) {
    throw new EnsureAdminError();
  }
  next();
}
