import { IMailProviderSendMailDTO } from "./IMailProviderSendMailDTO";

interface IMailProvider {
  sendMail({
    to,
    subject,
    variables,
    path,
  }: IMailProviderSendMailDTO): Promise<void>;
}

export { IMailProvider };
