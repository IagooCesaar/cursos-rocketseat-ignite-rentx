interface ICreateUserTokenDTO {
  id: string;
  expires_date: Date;
  refresh_token: string;
}

export { ICreateUserTokenDTO }