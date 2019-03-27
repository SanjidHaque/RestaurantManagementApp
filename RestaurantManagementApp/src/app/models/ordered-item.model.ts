export class OrderedItem {
  public Id: number;
  public ReceiptNumber: string;
  public OrderId: string;
  public FoodItemId: string;
  public FoodItemQuantity: number;
  public TotalPrice: number;

  constructor(id: number,
              receiptNumber: string,
              orderId: string,
              foodItemId: string,
              foodItemQuantity: number,
              totalPrice: number,
             ) {
    this.Id = id;
    this.ReceiptNumber = receiptNumber;
    this.OrderId = orderId;
    this.FoodItemId = foodItemId;
    this.FoodItemQuantity = foodItemQuantity;
    this.TotalPrice = totalPrice;
  }
}
