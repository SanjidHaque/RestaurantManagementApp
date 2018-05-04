
export class Ingredients {
  public Id: string;
  public Name: string;
  public Quantity: number;
  public Unit: string;
  public InventoryId: string;
  public InventoryPrice: number;
  public FoodItemId: string;

  constructor(id: string, name: string, quantity: number, unit: string,
              inventoryId: string, inventoryPrice: number, foodItemId: string) {
    this.Id = id;
    this.Name = name;
    this.Quantity = quantity;
    this.Unit = unit;
    this.InventoryId = inventoryId;
    this.InventoryPrice = inventoryPrice;
    this.FoodItemId = foodItemId;
  }
}
