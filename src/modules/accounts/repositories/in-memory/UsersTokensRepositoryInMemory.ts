import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UsersTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

import { IUsersTokensRepository } from "../IUsersTokensRepository";

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  private usersTokens: UsersTokens[] = [];

  async create(data: ICreateUserTokenDTO): Promise<UsersTokens> {
    const userToken = new UsersTokens();
    Object.assign(userToken, data);
    this.usersTokens.push(userToken);
    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UsersTokens> {
    return this.usersTokens.find(
      (userToken) =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token
    );
  }

  async findByRefreshToken(token: string): Promise<UsersTokens> {
    return this.usersTokens.find(
      (userToken) => userToken.refresh_token === token
    );
  }

  async deleteById(id: string): Promise<void> {
    const userTokenIndex = this.usersTokens.findIndex(
      (userToken) => userToken.id === id
    );
    this.usersTokens.splice(userTokenIndex, 1);
  }
}

export { UsersTokensRepositoryInMemory };
