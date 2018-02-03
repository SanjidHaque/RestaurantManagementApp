import {Inventory} from './inventory.model';

export class SummaryOfInventory {

  public Id : number;
  public ItemUsedName: string;
  public ItemTotal: number;
  public ItemUsedToday: number;
  public ItemRemaining : number;
  public Inventory: Inventory[];
  public InventoryId : string;
  public Unit: number;

constructor(id: number, itemUsedName: string, itemTotal: number, itemUsedToday: number,
            itemRemaining: number, inventory: Inventory[], inventoryId: string, unit: number) {
    this.Id = id;
    this.ItemUsedName = itemUsedName;
    this.ItemTotal = itemTotal;
    this.ItemRemaining = itemRemaining;
    this.ItemUsedToday = itemUsedToday;
    this.Inventory = inventory;
    this.InventoryId = inventoryId;
    this.Unit = unit;
}

}
