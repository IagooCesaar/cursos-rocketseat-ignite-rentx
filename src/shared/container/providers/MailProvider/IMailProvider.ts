import { IMailProviderSendMailDTO } from "./IMailProviderSendMailDTO";

interface IMailProvider {
  sendMail({ to, body, subject }: IMailProviderSendMailDTO): Promise<void>;
}

export { IMailProvider };
