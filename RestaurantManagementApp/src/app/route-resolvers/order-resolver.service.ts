import { Injectable } from '@angular/core';
import {Order} from '../models/order.model';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataStorageService} from '../services/data-storage.service';

@Injectable()
export class OrderResolverService implements Resolve<Order[]> {

  constructor(private dataStorageService: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order[]> |
    Promise<Order[]> | Order[] {
    return this.dataStorageService.getOrders();
  }

}
