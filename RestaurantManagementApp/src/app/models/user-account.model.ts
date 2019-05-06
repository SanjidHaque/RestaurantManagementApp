export class UserAccount {
  constructor(
    public userName: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public phoneNumber: string,
    public addingDateTime: string,
    public roleName: string
  ) {}
}
