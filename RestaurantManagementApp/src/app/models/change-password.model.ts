export class ChangePassword {
  constructor(
    public UserAccountId: string,
    public UserAccountName: string,
    public OldPassword: string,
    public NewPassword: string,
    public PasswordResetCode: string
  ) {}
}
