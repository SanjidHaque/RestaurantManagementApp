import {OrderSession} from './order-session.model';

export class Order {
  public Id: number;
  public OrderSessions: OrderSession[];
  public TotalPrice: number;
  public Tendered: number;
  public Change: number;
  public DateTime: string;
  public InventoryCost: number;
  public Profit: number;
  public TableId: number;
  public CurrentState: string;

  constructor(id: number,
              orderSessions: OrderSession[],
              totalPrice: number,
              tendered: number,
              change: number,
              dateTime: string,
              inventoryCost: number,
              profit: number,
              tableId: number,
              currentState: string
  ) {
    this.Id = id;
    this.OrderSessions = orderSessions;
    this.TotalPrice = totalPrice;
    this.Tendered = tendered;
    this.Change = change;
    this.DateTime = dateTime;
    this.InventoryCost = inventoryCost;
    this.Profit = profit;
    this.TableId = tableId;
    this.CurrentState = currentState;
  }
}
