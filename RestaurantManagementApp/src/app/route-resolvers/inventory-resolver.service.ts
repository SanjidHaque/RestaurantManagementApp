import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {InventoryDataStorageService} from '../services/data-storage/inventory-data-storage.service';

@Injectable()
export class InventoryResolverService  implements Resolve<any> {

  constructor(private inventoryDataStorageService: InventoryDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.inventoryDataStorageService
      .getInventory(+route.paramMap.get('inventory-id'));
  }
}
