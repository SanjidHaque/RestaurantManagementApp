export class UserAccount {
  constructor(
    public Id: string,
    public UserName: string,
    public FirstName: string,
    public LastName: string,
    public Email: string,
    public Password: string,
    public PhoneNumber: string,
    public AddingDateTime: string,
    public RoleName: string
  ) {}
}
