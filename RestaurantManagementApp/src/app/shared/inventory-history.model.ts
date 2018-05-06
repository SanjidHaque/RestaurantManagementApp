export class InventoryHistoryModel {
  public Id: string;
  public InventoryId: string;
  public UpdatedQuantity: number;
  public UpdateTime: string;
  public Unit: string;

  constructor(id: string, inventoryId: string, updatedQuantity: number,
              updateTime: string, unit: string) {
    this.Id = id;
    this.InventoryId = inventoryId;
    this.UpdatedQuantity = updatedQuantity;
    this.UpdateTime = updateTime;
    this.Unit = unit;
  }
 }
