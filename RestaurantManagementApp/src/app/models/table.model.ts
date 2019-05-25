import {Order} from './order.model';

export class Table {
  public Id: number;
  public Name: string;
  public CurrentState: string;
  public Orders: Order[];

  constructor(id: number,
              name: string,
              currentState: string,
              orders: Order[]
  ) {
    this.Id = id;
    this.Name = name;
    this.CurrentState = currentState;
    this.Orders = orders;
  }
 }
