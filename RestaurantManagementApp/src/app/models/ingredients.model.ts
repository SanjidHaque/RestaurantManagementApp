export class Ingredients {
  public Id: number;
  public Name: string;
  public Quantity: number;
  public InventoryId: number;
  public SubTotal: number;
  public FoodItemId: number;

  constructor(id: number,
              name: string,
              quantity: number,
              inventoryId: number,
              subTotal: number,
              foodItemId: number) {

    this.Id = id;
    this.Name = name;
    this.Quantity = quantity;
    this.InventoryId = inventoryId;
    this.SubTotal = subTotal;
    this.FoodItemId = foodItemId;
  }
}
