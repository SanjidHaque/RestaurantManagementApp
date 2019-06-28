import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import {Resolve} from '@angular/router';

import {Inventory} from '../models/inventory.model';
import {InventoryDataStorageService} from '../services/data-storage/inventory-data-storage.service';

@Injectable()
export class InventoriesResolverService  implements Resolve<Inventory[]> {

  constructor(private inventoryDataStorageService: InventoryDataStorageService) { }

  resolve(): Observable<Inventory[]> | Promise<Inventory[]> | Inventory[] {
    return this.inventoryDataStorageService.getAllInventory();
  }

}
