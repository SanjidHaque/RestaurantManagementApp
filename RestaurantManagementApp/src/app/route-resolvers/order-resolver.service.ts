import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {OrderDataStorageService} from '../services/data-storage/order-data-storage.service';

@Injectable()
export class OrderResolverService implements Resolve<any> {

  constructor(private orderDataStorageService: OrderDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.orderDataStorageService.getOrder(+route.paramMap.get('order-id'));
  }

}
