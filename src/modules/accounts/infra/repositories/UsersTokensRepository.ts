import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { getRepository, Repository } from "typeorm";
import { UsersTokens } from "../typeorm/entities/UserTokens";
import { UsersRepository } from "./UsersRepository";

class UsersTokensRepository implements IUsersTokensRepository {
  private repository: Repository<UsersTokens>

  constructor() {
    this.repository = getRepository(UsersTokens)
  }
    
  async create({id, refresh_token, expires_date}: ICreateUserTokenDTO): Promise<UsersTokens> {
    const userToken = this.repository.create({
      id,
      refresh_token,
      expires_date
    })
    await this.repository.save(userToken)
    return userToken
  }
}

export { UsersTokensRepository }