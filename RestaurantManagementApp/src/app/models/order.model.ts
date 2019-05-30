import {OrderSession} from './order-session.model';

export class Order {
  public Id: number;
  public OrderSessions: OrderSession[];
  public TotalPrice: number;
  public GrossTotalPrice: number;
  public Tendered: number;
  public Change: number;
  public DateTime: string;
  public InventoryCost: number;
  public Profit: number;
  public TableId: number;
  public CurrentState: string;
  public Vat: number;
  public ServiceCharge: number;
  public DiscountType: string;
  public DiscountRate: number;
  public DiscountAmount: number;
  public UserName: string;


  constructor(id: number,
              orderSessions: OrderSession[],
              totalPrice: number,
              grossTotalPrice: number,
              tendered: number,
              change: number,
              dateTime: string,
              inventoryCost: number,
              profit: number,
              tableId: number,
              currentState: string,
              vat: number,
              serviceCharge: number,
              discountType: string,
              discountRate: number,
              discountAmount: number,
              userName: string
  ) {
    this.Id = id;
    this.OrderSessions = orderSessions;
    this.TotalPrice = totalPrice;
    this.GrossTotalPrice = grossTotalPrice;
    this.Tendered = tendered;
    this.Change = change;
    this.DateTime = dateTime;
    this.InventoryCost = inventoryCost;
    this.Profit = profit;
    this.TableId = tableId;
    this.CurrentState = currentState;
    this.Vat = vat;
    this.ServiceCharge = serviceCharge;
    this.DiscountType = discountType;
    this.DiscountRate = discountRate;
    this.DiscountAmount = discountAmount;
    this.UserName = userName;
  }
}
