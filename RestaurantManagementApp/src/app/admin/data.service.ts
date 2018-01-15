import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {OurOffers} from '../our-offers/our-offers.model';
import {OurOffersService} from '../our-offers/our-offers.service';
import {FoodItems} from '../shared/food-item.model';
import {map} from 'rxjs/operators';

@Injectable()
export class AdminDataService {

  // private _url = 'assets/menu-from-api.json';
  // private _url = 'http://localhost:1548/api/FoodItems';
  private _url = 'http://localhost:1548/api/menu';
  private _postUrl = 'http://localhost:1548/api/AddNewFoodItem';

  constructor(private _http: Http) { }

  getFoodItems() {
    return this._http.get(this._url)
      .map(
        (response: Response) => {
          const foodItems: OurOffers = response.json();
          console.log(foodItems);
          return foodItems;
        }
      );
    /*.subscribe(
      (menus: OurOffers[] ) => {
        this.ourOffersService.setOurOffers(menus);
      }
    );*/
  }

  postFoodItem(foodItem: FoodItems) {
    return this._http.post(this._postUrl, foodItem)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

  putFoodItem(foodItem: FoodItems) {
    return this._http.put(this._postUrl, foodItem)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

  deleteFoodItem(i: number) {
    return this._http.delete(this._postUrl, i)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
}
