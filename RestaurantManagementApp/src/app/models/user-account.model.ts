export class UserAccount {
  constructor(
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public phoneNumber: string,
    public addingDateTime: string,
    public role: string
  ) {}
}
