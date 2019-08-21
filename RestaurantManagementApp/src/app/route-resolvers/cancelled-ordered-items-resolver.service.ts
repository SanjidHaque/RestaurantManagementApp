import {Observable} from 'rxjs';
import {Resolve} from '@angular/router';
import { Injectable } from '@angular/core';

import {Table} from '../models/table.model';
import {TableDataStorageService} from '../services/data-storage/table-data-storage.service';
import {OrderedItem} from '../models/ordered-item.model';
import {OrderDataStorageService} from '../services/data-storage/order-data-storage.service';

@Injectable()
export class CancelledOrderedItemsResolverService implements Resolve<OrderedItem[]> {

  constructor(private orderDataStorageService: OrderDataStorageService) { }

  resolve(): Observable<OrderedItem[]> | Promise<OrderedItem[]> | OrderedItem[] {
    return this.orderDataStorageService.getAllCancelledOrderedItem();
  }
}


