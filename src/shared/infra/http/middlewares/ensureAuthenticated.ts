import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "@config/auth";
import { UsersTokensRepository } from "@modules/accounts/infra/repositories/UsersTokensRepository";
import { EnsureAuthenticatedError } from "@shared/errors/EnsureAuthenticatedError";

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
    throw new EnsureAuthenticatedError.TokenMissing();
  }
  const [, token] = authHeader.split(" ");
  try {
    const { sub: user_id } = verify(
      token,
      auth.secret_refresh_token
    ) as IPayload;

    const usersTokensRepository = new UsersTokensRepository();
    const user = await usersTokensRepository.findByUserIdAndRefreshToken(
      user_id,
      token
    );
    if (!user) {
      throw new EnsureAuthenticatedError.UserNotExists();
    }

    request.user = {
      id: user_id,
    };
    next();
  } catch (error) {
    throw new EnsureAuthenticatedError.InvalidToken();
  }
}
