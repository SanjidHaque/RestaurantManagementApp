import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {OurOffersService} from '../our-offers/our-offers.service';
import { SetMenu } from '../our-offers/our-offers.model';

@Injectable()
export class DataStorageService {
  private _url = 'assets/set-menu.json';
  constructor(private _http: Http, private ourOffersService: OurOffersService) {

  }
  getRecipes() {
    this._http.get(this._url)
      .map(
        (response: Response) => {
           const setMenus: SetMenu[] = response.json();
           return setMenus;
         }
      )
      .subscribe(
        (setMenu: SetMenu[]) => {
          this.ourOffersService.setOurOffers(setMenu);
        }
      );
  }
}
