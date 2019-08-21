export class OrderedItem {
  public Id: number;
  public OrderSessionId: number;
  public FoodItemId: number;
  public FoodItemQuantity: number;
  public TotalPrice: number;
  public CurrentState: string;
  public CancellationReason: string;

  constructor(id: number,
              orderSessionId: number,
              foodItemId: number,
              foodItemQuantity: number,
              totalPrice: number,
              currentState: string,
              cancellationReason: string
             ) {
    this.Id = id;
    this.OrderSessionId = orderSessionId;
    this.FoodItemId = foodItemId;
    this.FoodItemQuantity = foodItemQuantity;
    this.TotalPrice = totalPrice;
    this.CurrentState = currentState;
    this.CancellationReason = cancellationReason;
  }
}
