interface IMailProviderSendMailDTO {
  to: string;
  subject: string;
  variables: any;
  path: string;
}

export { IMailProviderSendMailDTO };
