import { Injectable } from '@angular/core';
import {Order} from '../shared/order.model';
import {Subject} from 'rxjs/Subject';
import {DataStorageService} from '../shared/data-storage.service';

@Injectable()
export class ChefServiceService {
  Order: Order;

  constructor(private __dataStorageService: DataStorageService) { }

  ordersChanged(order: Order) {
       this.__dataStorageService.getOrders()
        .subscribe(
          (Orders: Order) => {
            this.Order = Orders;
          }
        );
       this.Order.OnChef = true;
  }

}


