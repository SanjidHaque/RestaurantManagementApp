import {Observable} from 'rxjs';
import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';

import {Inventory} from '../models/inventory.model';
import {InventoryDataStorageService} from '../services/data-storage/inventory-data-storage.service';

@Injectable()
export class InventoryResolverService  implements Resolve<Inventory[]> {

  constructor(private inventoryDataStorageService: InventoryDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Inventory[]> |
    Promise<Inventory[]> | Inventory[] {
    return this.inventoryDataStorageService.getAllInventoryItem();
  }

}
