import {OrderedItems} from './ordered-items.model';

export class Order {
  public Id: string;
  public OrderedItems: OrderedItems[];
  public TotalPrice: number;
  public Tendered: number;
  public Change: number;
  public DateTime: string;
  public TableNo: string;
  public InventoryCost: number;
  public Profit: number;

  constructor(id: string, orderedItems: OrderedItems[], totalPrice: number,
              tendered: number, change: number ,
              dateTime: string, tableNo: string, inventoryCost: number, profit: number) {
    this.Id = id;
    this.OrderedItems = orderedItems;
    this.TotalPrice = totalPrice;
    this.Tendered = tendered;
    this.Change = change;
    this.DateTime = dateTime;
    this.TableNo = tableNo;
    this.InventoryCost = inventoryCost;
    this.Profit = profit;
  }
}
