import { Injectable } from '@angular/core';
import {Inventory} from '../models/inventory.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataStorageService} from '../services/data-storage.service';
import {Observable} from 'rxjs';

@Injectable()
export class InventoryResolverService  implements Resolve<Inventory[]> {

  constructor(private dataStorageService: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Inventory[]> |
    Promise<Inventory[]> | Inventory[] {
    return this.dataStorageService.getAllInventoryItem();
  }

}
