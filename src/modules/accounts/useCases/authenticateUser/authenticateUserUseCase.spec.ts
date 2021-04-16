import { ICreateUserDTO } from "@modules/accounts/dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";

import { CreateUserUseCase } from "../createUser/createUserUseCase";
import { AuthenticateUserError } from "./AuthenticateUserError";
import { AuthenticateUserUseCase } from "./authenticateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;

describe("Authenticate User Use Case", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to authenticate a user", async () => {
    const user: ICreateUserDTO = {
      driver_license: "00123",
      email: "user@test.com",
      name: "User Test",
      password: "1234",
    };

    await createUserUseCase.execute(user);
    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  }, 50000);

  it("Should not permit a nonexistent user to authenticate", async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: "false@test.com",
        password: "secret",
      })
    ).rejects.toBeInstanceOf(AuthenticateUserError);
  });

  it("Should not be able to authenticate a user with incorrect password", async () => {
    const user: ICreateUserDTO = {
      driver_license: "00123",
      email: "user@test.com",
      name: "User Test",
      password: "1234",
    };
    await createUserUseCase.execute(user);

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrect",
      })
    ).rejects.toBeInstanceOf(AuthenticateUserError);
  }, 15000);
});
