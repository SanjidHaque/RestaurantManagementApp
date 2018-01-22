import {Inventory} from './inventory.model';

export class Ingredients {
  public Id: string;
  public Quantity: number;
  public Unit: number;
  public InventoryId: string;
  public FoodItemId: string;

  constructor(id: string, quantity: number, unit: number,
              inventoryId: string, foodItemId: string) {
    this.Id = id;
    this.Quantity = quantity;
    this.Unit = unit;
    this.InventoryId = inventoryId;
    this.FoodItemId = foodItemId;
  }
}
