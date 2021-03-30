import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import { AppError } from "../errors/appError";
import { UsersRepository } from "../modules/accounts/repositories/implementations/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }
  const [, token] = authHeader.split(" ");
  try {
    const { sub } = verify(
      token,
      "d3acee670ad999360c2b5315b8f5b71c"
    ) as IPayload;

    const usersRepository = new UsersRepository();
    const user = await usersRepository.findById(sub);
    if (!user) {
      throw new AppError("User does not exists", 401);
    }
  } catch (error) {
    throw new AppError("Invalid token", 401);
  }

  next();
}
