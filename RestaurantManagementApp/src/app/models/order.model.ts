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
  public VatAmount: number;
  public ServiceChargeAmount: number;
  public DiscountType: string;
  public DiscountRate: number;
  public DiscountAmount: number;
  public SalesPersonName: string;


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
              vatAmount: number,
              serviceChargeAmount: number,
              discountType: string,
              discountRate: number,
              discountAmount: number,
              salesPersonName: string
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
    this.VatAmount = vatAmount;
    this.ServiceChargeAmount = serviceChargeAmount;
    this.DiscountType = discountType;
    this.DiscountRate = discountRate;
    this.DiscountAmount = discountAmount;
    this.SalesPersonName = salesPersonName;
  }
}
