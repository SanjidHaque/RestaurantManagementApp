import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataStorageService} from '../services/data-storage.service';
import {FoodItem} from '../models/food-item.model';

@Injectable()
export class FoodItemResolverService  implements Resolve<FoodItem[]> {

  constructor(private dataStorageService: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FoodItem[]> |
    Promise<FoodItem[]> | FoodItem[] {
    return this.dataStorageService.getAllFoodItem();
  }

}
