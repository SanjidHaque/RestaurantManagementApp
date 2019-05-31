export class Setting {
  constructor(
    public Id: number,
    public ShopName: string,
    public ShopAddress: string,
    public ShopPhone: string,
    public ShopEmail: string,
    public ShopFacebookPage: string,
    public VatRate: number,
    public VatRegNumber: string,
    public VatType: string,
    public ServiceChargeRate: number,
    public AdditionalInformation: string,
    public PrintChefsOrderReceipt: boolean
  ) {}
}
