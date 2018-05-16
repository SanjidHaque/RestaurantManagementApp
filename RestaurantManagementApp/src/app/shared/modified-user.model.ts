export class ModifiedUserModel {
  public UserName: string;
  public Email: string;
  public Role: string;
  public DateTime: string;

  constructor (userName: string, email: string, role: string, dateTime: string) {
    this.UserName = userName;
    this.Email = email;
    this.Role = role;
    this.DateTime = dateTime;
  }
}
