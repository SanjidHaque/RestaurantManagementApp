import {Observable} from 'rxjs';
import {Resolve} from '@angular/router';
import { Injectable } from '@angular/core';

import {Order} from '../models/order.model';
import {OrderDataStorageService} from '../services/data-storage/order-data-storage.service';

@Injectable()
export class OrdersResolverService implements Resolve<Order[]> {

  constructor(private orderDataStorageService: OrderDataStorageService) { }

  resolve(): Observable<Order[]> | Promise<Order[]> | Order[] {
    return this.orderDataStorageService.getAllOrder();
  }

}
