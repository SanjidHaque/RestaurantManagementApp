import {Observable} from 'rxjs';
import {Resolve} from '@angular/router';
import { Injectable } from '@angular/core';

import {FoodItem} from '../models/food-item.model';
import {FoodItemDataStorageService} from '../services/data-storage/food-item-data-storage.service';

@Injectable()
export class FoodItemsResolverService  implements Resolve<FoodItem[]> {

  constructor(private foodItemDataStorageService: FoodItemDataStorageService) { }

  resolve(): Observable<FoodItem[]> | Promise<FoodItem[]> | FoodItem[] {
    return this.foodItemDataStorageService.getAllFoodItem();
  }

}
