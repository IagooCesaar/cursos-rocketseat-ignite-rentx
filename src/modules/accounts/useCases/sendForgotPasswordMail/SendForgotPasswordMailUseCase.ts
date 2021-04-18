import { resolve } from "path";
import { inject, injectable } from "tsyringe";
import { v4 as uuidV4 } from "uuid";

import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { IUsersTokensRepository } from "@modules/accounts/repositories/IUsersTokensRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { IMailProvider } from "@shared/container/providers/MailProvider/IMailProvider";

import { SendForgotPasswordMailError } from "./SendForgotPasswordMailError";

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UsersTokensRepository")
    private UsersTokensRepository: IUsersTokensRepository,

    @inject("DayjsDateProvider")
    private dateProvider: IDateProvider,

    @inject("MailProvider")
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new SendForgotPasswordMailError();
    }

    const expires_date = this.dateProvider.addHours(3, null);
    const token = uuidV4();
    await this.UsersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    });

    const templatePath = resolve(
      __dirname,
      "..",
      "..",
      "views",
      "emails",
      "ForgotPassword.hbs"
    );

    const templateVariables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`,
    };
    // FORGOT_MAIL_URL = http://localhost:3333/password/reset?token=

    await this.mailProvider.sendMail({
      to: user.email,
      subject: "Recuperação de senha",
      path: templatePath,
      variables: templateVariables,
    });
  }
}

export { SendForgotPasswordMailUseCase };
