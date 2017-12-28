export class OrderedItems {
  public Id: string;
  public OrderId: string;
  public FoodItemId?: number;
  public Quantity: number;
  public SetMenuId?: number;
  public SetMenuName: string;
  public Price: number;



  constructor(id: string, orderId: string, foodItemId: number, quantity: number, setMenuId: number, setMenuName: string, price: number) {
    this.Id = id;
    this.OrderId = orderId;
    this.FoodItemId = foodItemId;
    this.Quantity = quantity;
    this.SetMenuId = setMenuId;
    this.SetMenuName = setMenuName;
    this.Price = price;
  }
}
