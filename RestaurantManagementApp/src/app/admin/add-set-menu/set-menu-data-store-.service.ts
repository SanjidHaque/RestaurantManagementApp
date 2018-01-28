import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {OurOffersService} from '../../our-offers/our-offers.service';
import {Http, Response} from '@angular/http';
import {FoodItems} from '../../shared/food-item.model';
import {SetMenus} from '../../shared/set-menu.model';
import {OurOffers} from '../../our-offers/our-offers.model';

@Injectable()
export class SetMenuDataStoreService {

  // private _url = 'assets/menu-from-api.json';
  private _url = 'http://localhost:1548/api/menu';
  constructor(private _http: Http) {}

  getFoodItems() {
    return this._http.get(this._url)
      .map(
        (response: Response) => {
          const menu: OurOffers = response.json();
          return menu;
        }
      );
  }

  postSetMenu(setMenu: SetMenus) {
    return this._http.post('http://localhost:1548/api/AddSetMenu', setMenu)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

}
