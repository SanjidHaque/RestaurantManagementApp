import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';

import {FoodItemDataStorageService} from '../services/data-storage/food-item-data-storage.service';

@Injectable()
export class FoodItemResolverService  implements Resolve<any> {

  constructor(private foodItemDataStorageService: FoodItemDataStorageService) { }

  resolve(route: ActivatedRouteSnapshot) {
    return this.foodItemDataStorageService.getFoodItem(+route.paramMap.get('food-item-id'));
  }

}
