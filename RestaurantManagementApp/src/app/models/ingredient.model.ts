export class Ingredient {
  public Id: number;
  public Quantity: number;
  public InventoryId: number;
  public SubTotal: number;
  public FoodItemId: number;

  constructor(id: number,
              quantity: number,
              inventoryId: number,
              subTotal: number,
              foodItemId: number) {

    this.Id = id;
    this.Quantity = quantity;
    this.InventoryId = inventoryId;
    this.SubTotal = subTotal;
    this.FoodItemId = foodItemId;
  }
}
