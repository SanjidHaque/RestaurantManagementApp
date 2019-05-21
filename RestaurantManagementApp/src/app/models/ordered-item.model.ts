export class OrderedItem {
  public Id: number;
  public ReceiptNumber: string;
  public OrderId: number;
  public OrderSessionId: number;
  public FoodItemId: number;
  public FoodItemQuantity: number;
  public TotalPrice: number;

  constructor(id: number,
              receiptNumber: string,
              orderId: number,
              orderSessionId: number,
              foodItemId: number,
              foodItemQuantity: number,
              totalPrice: number,
             ) {
    this.Id = id;
    this.ReceiptNumber = receiptNumber;
    this.OrderId = orderId;
    this.OrderSessionId = orderSessionId;
    this.FoodItemId = foodItemId;
    this.FoodItemQuantity = foodItemQuantity;
    this.TotalPrice = totalPrice;
  }
}
