export class OrderedItems {
  public OrderItemId: string;
  public OrderId: string;
  public FoodItemId: string;
  public FoodItemQuantity: number;
  public FoodItemName: string;
  public FoodItemSerialNo: string;
  public Price: number;
  public FoodItemSubTotal?: number;
  public FoodItemMakingCost: number;



  constructor(orderItemId: string, orderId: string, foodItemId: string,
              foodItemQuantity: number, foodItemName: string, foodItemSerialNo: string,
              price: number, foodItemSubTotal: number,
              foodItemMakingCost: number ) {
    this.OrderItemId = orderItemId;
    this.OrderId = orderId;
    this.FoodItemId = foodItemId;
    this.FoodItemQuantity = foodItemQuantity;
    this.FoodItemName = foodItemName;
    this.FoodItemSerialNo = foodItemSerialNo;
    this.Price = price;
    this.FoodItemSubTotal = foodItemSubTotal;
    this.FoodItemMakingCost = foodItemMakingCost;
  }
}
