import {OrderedItems} from './ordered-items.model';

export class Order {
  public Id: string;
  public OrderedItems: OrderedItems[];

  constructor(id: string, orderedItems: OrderedItems[]) {
    this.Id = id;
    this.OrderedItems = orderedItems;
  }
}
