import { UsersRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayJsDateProvider";
import { MailProviderInMemory } from "@shared/container/providers/MailProvider/in-memory/MailProviderInMemoy";

import { SendForgotPasswordMailError } from "./SendForgotPasswordMailError";
import { SendForgotPasswordMailUseCase } from "./SendForgotPasswordMailUseCase";

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dateProvider: DayjsDateProvider;
let mailProvider: MailProviderInMemory;

describe("SendForgotPasswordMailUseCase", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DayjsDateProvider();
    mailProvider = new MailProviderInMemory();

    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider,
      mailProvider
    );
  });

  it("Should be able to send a email for a user to reset his password", async () => {
    const sendMail = spyOn(mailProvider, "sendMail");

    await usersRepositoryInMemory.create({
      driver_license: "3512329605",
      email: "tokvuzer@vadinvo.gn",
      name: "Allie Jenkins",
      password: "test",
    });
    await sendForgotPasswordMailUseCase.execute("tokvuzer@vadinvo.gn");

    expect(sendMail).toHaveBeenCalled();
  });

  it("Should not be able to send a email for an inexistent user", async () => {
    const sendMail = spyOn(mailProvider, "sendMail");
    await expect(
      sendForgotPasswordMailUseCase.execute("cucok@soson.au")
    ).rejects.toBeInstanceOf(SendForgotPasswordMailError);

    expect(sendMail).not.toBeCalled();
  });

  it("Should be able to create a new token to reset password", async () => {
    const generatedToken = spyOn(usersTokensRepositoryInMemory, "create");

    await usersRepositoryInMemory.create({
      driver_license: "3512329605",
      email: "tokvuzer@vadinvo.gn",
      name: "Allie Jenkins",
      password: "test",
    });
    await sendForgotPasswordMailUseCase.execute("tokvuzer@vadinvo.gn");

    expect(generatedToken).toHaveBeenCalled();
  });
});
