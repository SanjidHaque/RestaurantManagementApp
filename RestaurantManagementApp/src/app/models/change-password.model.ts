export class ChangePassword {
  constructor(
    public UserAccountId: string,
    public OldPassword: string,
    public NewPassword: string
  ) {}
}
