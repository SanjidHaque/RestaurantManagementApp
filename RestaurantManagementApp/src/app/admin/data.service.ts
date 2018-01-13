import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {OurOffers} from '../our-offers/our-offers.model';
import {OurOffersService} from '../our-offers/our-offers.service';
import {FoodItems} from '../shared/food-item.model';
import {map} from 'rxjs/operators';

@Injectable()
export class AdminDataService {

  private _url = 'assets/menu-from-api.json';
  // private _url = 'http://localhost:1548/api/menu';

  constructor(private _http: Http) { }
  getFoods() {
    return this._http.get(this._url);
    // .map(
    //   (response: Response) => {
    //     const foods: FoodItems = response.json();
    //     return foods;
    //   }
    // );
    /*.subscribe(
      (menus: OurOffers[] ) => {
        this.ourOffersService.setOurOffers(menus);
      }
    );*/
  }
}
