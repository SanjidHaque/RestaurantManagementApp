export class OrderedItems {
  public OrderItemId: string;
 /* public OrderId: string;*/
  public FoodItemId?: number;
  public Quantity: number;
  public SetMenuId?: number;
  public SetMenuName: string;
  public Price: number;
  public SubTotal: number;



  constructor(orderItemId: string/*, orderId: string*/, foodItemId: number, quantity: number,
              setMenuId: number, setMenuName: string, price: number, subTotal: number) {
    this.OrderItemId = orderItemId;
    /*this.OrderId = orderId;*/
    this.FoodItemId = foodItemId;
    this.Quantity = quantity;
    this.SetMenuId = setMenuId;
    this.SetMenuName = setMenuName;
    this.Price = price;
    this.SubTotal = subTotal;
  }
}
