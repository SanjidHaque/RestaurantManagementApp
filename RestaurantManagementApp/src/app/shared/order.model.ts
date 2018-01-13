import {OrderedItems} from './ordered-items.model';

export class Order {
  public Id: string;
  public OrderedItems: OrderedItems[];
  public TotalPrice: number;
  public IsServed: boolean;

  constructor(id: string, orderedItems: OrderedItems[], totalPrice: number, isServed: boolean) {
    this.Id = id;
    this.OrderedItems = orderedItems;
    this.TotalPrice = totalPrice;
    this.IsServed = isServed;
  }
}
