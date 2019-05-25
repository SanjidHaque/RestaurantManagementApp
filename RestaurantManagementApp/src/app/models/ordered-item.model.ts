export class OrderedItem {
  public Id: number;
  public OrderId: number;
  public OrderSessionId: number;
  public FoodItemId: number;
  public FoodItemQuantity: number;
  public TotalPrice: number;

  constructor(id: number,
              orderId: number,
              orderSessionId: number,
              foodItemId: number,
              foodItemQuantity: number,
              totalPrice: number,
             ) {
    this.Id = id;
    this.OrderId = orderId;
    this.OrderSessionId = orderSessionId;
    this.FoodItemId = foodItemId;
    this.FoodItemQuantity = foodItemQuantity;
    this.TotalPrice = totalPrice;
  }
}
