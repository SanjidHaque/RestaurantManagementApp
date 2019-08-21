import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {OrderDataStorageService} from '../services/data-storage/order-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CancelledOrderedItemResolverService implements Resolve<any> {

  constructor(private orderDataStorageService: OrderDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.orderDataStorageService.getCancelledOrderedItem(+route.paramMap.get('cancelled-ordered-item-id'));
  }

}
