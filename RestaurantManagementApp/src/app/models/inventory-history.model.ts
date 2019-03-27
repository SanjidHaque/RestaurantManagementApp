export class InventoryHistory {
  public Id: number;
  public InventoryId: number;
  public UpdatedQuantity: number;
  public UpdateTime: string;
  public CurrentPrice: number;

  constructor(id: number,
              inventoryId: number,
              updatedQuantity: number,
              updateTime: string,
              currentPrice: number
  ) {
    this.Id = id;
    this.InventoryId = inventoryId;
    this.UpdatedQuantity = updatedQuantity;
    this.UpdateTime = updateTime;
    this.CurrentPrice = currentPrice;
  }
 }
