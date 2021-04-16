import { hash } from "bcryptjs";
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";

import { ResetUsersPasswordError } from "./ResetUsersPasswordError";

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetUsersPasswordUseCase {
  constructor(
    @inject("UsersTokensRepository")
    private usersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,

    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ token, password }: IRequest): Promise<void> {
    console.log("receive token", token);
    const userToken = await this.usersTokensRepository.findByRefreshToken(
      token
    );
    if (!userToken) {
      throw new ResetUsersPasswordError.TokenInvalid();
    }
    if (
      this.dateProvider.checkIsBefore(
        userToken.expires_date,
        this.dateProvider.dateNow()
      )
    ) {
      throw new ResetUsersPasswordError.TokenExpired();
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    user.password = await hash(
      password,
      Number(process.env.DEFAULT_HASH_SAULT)
    );
    await this.usersRepository.create(user);

    await this.usersTokensRepository.deleteById(userToken.id);
  }
}

export { ResetUsersPasswordUseCase };
