import { Injectable } from '@angular/core';
import {Order} from '../shared/order.model';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class ChefServiceService {
  orderAccepted = false;
  public ordersChanged = new Subject<Order>();

  constructor() { }

}
