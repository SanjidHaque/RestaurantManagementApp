import {OrderedItem} from './ordered-item.model';

export class OrderSession {
  constructor(
    public Id: number,
    public OrderId: number,
    public OrderedItems: OrderedItem[] = [],
    public CurrentState: string,
    public OrderedDateTime: string,
    public ServedDateTime: string
  ) {}
}
