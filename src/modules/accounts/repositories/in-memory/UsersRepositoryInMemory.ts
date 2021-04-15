import { User } from "@modules/accounts/infra/typeorm/entities/User";

import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async getAll(): Promise<User[]> {
    return this.users;
  }

  async create({
    driver_license,
    email,
    name,
    password,
    avatar,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, {
      driver_license,
      email,
      name,
      password,
      avatar,
    });
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = this.users.find((user) => user.email === email);
    return user;
  }

  async findById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }
}

export { UsersRepositoryInMemory };
