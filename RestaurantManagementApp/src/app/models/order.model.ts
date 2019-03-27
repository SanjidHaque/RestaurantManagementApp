import {OrderedItem} from './ordered-item.model';

export class Order {
  public Id: number;
  public OrderedItem: OrderedItem[];
  public TotalPrice: number;
  public Tendered: number;
  public Change: number;
  public DateTime: string;
  public TableNumber: string;
  public InventoryCost: number;
  public Profit: number;

  constructor(id: number,
              orderedItem: OrderedItem[],
              totalPrice: number,
              tendered: number,
              change: number,
              dateTime: string,
              tableNumber: string,
              inventoryCost: number,
              profit: number) {
    this.Id = id;
    this.OrderedItem = orderedItem;
    this.TotalPrice = totalPrice;
    this.Tendered = tendered;
    this.Change = change;
    this.DateTime = dateTime;
    this.TableNumber = tableNumber;
    this.InventoryCost = inventoryCost;
    this.Profit = profit;
  }
}
