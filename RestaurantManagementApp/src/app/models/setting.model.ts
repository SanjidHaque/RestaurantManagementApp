export class Setting {
  constructor(
    public Id: number,
    public ShopName: string,
    public ShopAddress: string,
    public ShopPhone: string,
    public ShopEmail: string,
    public ShopFacebookPage: string,
    public VatAmount: number,
    public VatRegNumber: string,
    public VatType: string,
    public ServiceCharge: number,
    public AdditionalInformation: string
  ) {}
}
