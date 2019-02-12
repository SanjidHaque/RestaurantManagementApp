import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {DataStorageService} from '../../shared/data-storage.service';
import {FoodItems} from '../../shared/food-item.model';

@Injectable()
export class FoodItemResolverService  implements Resolve<FoodItems> {

  constructor(private _dataStorageService: DataStorageService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> |
    Promise<any> | any {
    return this._dataStorageService.getFoodItems();
  }

}
