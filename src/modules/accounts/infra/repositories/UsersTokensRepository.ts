import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";

import { UsersTokens } from "../typeorm/entities/UserTokens";

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UsersTokens>;

  constructor() {
    this.repository = getRepository(UsersTokens);
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UsersTokens> {
    const userTokens = await this.repository.findOne({
      user_id,
      refresh_token,
    });
    return userTokens;
  }

  async create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UsersTokens> {
    const userToken = this.repository.create({
      user_id,
      refresh_token,
      expires_date,
    });
    await this.repository.save(userToken);
    return userToken;
  }
}

export { UsersTokensRepository };
