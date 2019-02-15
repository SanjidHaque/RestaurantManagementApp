import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataStorageService} from '../services/data-storage.service';
import {FoodItems} from '../models/food-item.model';

@Injectable()
export class FoodItemResolverService  implements Resolve<FoodItems[]> {

  constructor(private dataStorageService: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FoodItems[]> |
    Promise<FoodItems[]> | FoodItems[] {
    return this.dataStorageService.getFoodItems();
  }

}
