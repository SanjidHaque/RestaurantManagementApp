import { Injectable } from '@angular/core';
import {Order} from '../../shared/order.model';
import {Observable} from 'rxjs/Observable';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataStorageService} from '../../shared/data-storage.service';

@Injectable()
export class OrderResolverService implements Resolve<Order> {

  constructor(private _dataStorageService: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> |
    Promise<any> | any {
    return this._dataStorageService.getOrders();
  }

}
