import { ICreateUserTokenDTO } from "../dtos/ICreateUserTokenDTO";
import { UsersTokens } from "../infra/typeorm/entities/UserTokens";

interface IUsersTokensRepository {
  create(data: ICreateUserTokenDTO): Promise<UsersTokens>;
  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UsersTokens>;
  findByRefreshToken(token: string): Promise<UsersTokens>;
  deleteById(id: string): Promise<void>;
}

export { IUsersTokensRepository };
