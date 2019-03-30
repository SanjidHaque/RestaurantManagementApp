export class InventoryHistory {
  public Id: number;
  public InventoryId: number;
  public BuyingQuantity: number;
  public BuyingTime: string;
  public BuyingPrice: number;

  constructor(id: number,
              inventoryId: number,
              buyingQuantity: number,
              buyingTime: string,
              buyingPrice: number
  ) {
    this.Id = id;
    this.InventoryId = inventoryId;
    this.BuyingQuantity = buyingQuantity;
    this.BuyingTime = buyingTime;
    this.BuyingPrice = buyingPrice;
  }
 }
