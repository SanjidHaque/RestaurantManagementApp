import { Injectable } from '@angular/core';
import {Order} from '../models/order.model';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {OrderDataStorageService} from '../services/data-storage/order-data-storage.service';

@Injectable()
export class OrderResolverService implements Resolve<Order[]> {

  constructor(private orderDataStorageService: OrderDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order[]> |
    Promise<Order[]> | Order[] {
    return this.orderDataStorageService.getAllOrder();
  }

}
