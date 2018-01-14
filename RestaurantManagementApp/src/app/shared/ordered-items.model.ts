export class OrderedItems {
  public OrderItemId: string;
  public OrderId: string;
  public FoodItemId?: number;
  public SetMenuQuantity?: number;
  public FoodItemQuantity?: number;
  public SetMenuId?: number;
  public SetMenuName?: string;
  public FoodItemName?: string;
  public Price: number;
  public SetMenuSubTotal: number;
  public FoodItemSubTotal: number;



  constructor(orderItemId: string, orderId: string, foodItemId: number, setMenuQuantity: number,
            foodItemQuantity: number,  setMenuId: number, setMenuName: string, foodItemName: string,
              price: number, setMenuSubTotal: number, foodItemSubTotal: number ) {
    this.OrderItemId = orderItemId;
    this.OrderId = orderId;
    this.FoodItemId = foodItemId;
    this.SetMenuQuantity = setMenuQuantity;
    this.FoodItemQuantity = foodItemQuantity;
    this.SetMenuId = setMenuId;
    this.SetMenuName = setMenuName;
    this.FoodItemName = foodItemName;
    this.Price = price;
    this.SetMenuSubTotal = setMenuSubTotal;
    this.FoodItemSubTotal = foodItemSubTotal;
  }
}
