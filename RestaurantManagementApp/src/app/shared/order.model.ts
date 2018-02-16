import {OrderedItems} from './ordered-items.model';

export class Order {
  public Id: string;
  public OrderedItems: OrderedItems[];
  public TotalPrice: number;
  public Tendered: number;
  public Change: number;
  public OrderStatus: number;
  public DateTime: string;

  constructor(id: string, orderedItems: OrderedItems[], totalPrice: number,
              tendered: number, change: number, orderStatus: number, dateTime: string) {
    this.Id = id;
    this.OrderedItems = orderedItems;
    this.TotalPrice = totalPrice;
    this.Tendered = tendered;
    this.Change = change;
    this.OrderStatus = orderStatus;
    this.DateTime = dateTime;
  }
}
