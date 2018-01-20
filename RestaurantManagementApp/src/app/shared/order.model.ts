import {OrderedItems} from './ordered-items.model';

export class Order {
  public Id: string;
  public OrderedItems: OrderedItems[];
  public TotalPrice: number;
  public OrderStatus: number;

  constructor(id: string, orderedItems: OrderedItems[],
              totalPrice: number, orderStatus: number) {
    this.Id = id;
    this.OrderedItems = orderedItems;
    this.TotalPrice = totalPrice;
    this.OrderStatus = orderStatus;
  }
}
