import { Injectable } from '@angular/core';
import {Inventory} from '../models/inventory.model';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataStorageService} from '../services/data-storage.service';
import {Observable} from 'rxjs';

@Injectable()
export class InventoryResolverService  implements Resolve<Inventory> {

  constructor(private _dataStorageService: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> |
    Promise<any> | any {
    return this._dataStorageService.getInventories();
  }

}
