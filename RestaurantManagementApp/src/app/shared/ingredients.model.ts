import {Inventory} from './inventory.model';

export class Ingredients {
  public Id: number;
  public Quantity: number;
  public Unit: number;
  public InventoryId: number;
  public FoodItemId: number;

  constructor(id: number, quantity: number, unit: number, inventoryId: number, foodItemId: number) {
    this.Id = id;
    this.Quantity = quantity;
    this.Unit = unit;
    this.InventoryId = inventoryId;
    this.FoodItemId = foodItemId;
  }
}
