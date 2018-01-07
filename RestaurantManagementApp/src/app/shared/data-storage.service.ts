import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import {OurOffersService} from '../our-offers/our-offers.service';
import {OurOffers} from '../our-offers/our-offers.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
@Injectable()
export class DataStorageService {

  private _url = 'assets/menu-from-api.json';
  /*private _url = 'http://localhost:1548/api/menu';*/
  constructor(private _http: Http, private ourOffersService: OurOffersService) { }
  getMenu() {
    return this._http.get(this._url)
      .map(
        (response: Response) => {
           const menus: OurOffers = response.json();
           return menus;
         }
      );
      /*.subscribe(
        (menus: OurOffers[] ) => {
          this.ourOffersService.setOurOffers(menus);
        }
      );*/
  }

 /* public getJson(): Observable<any> {
    return this._http.get(this._url)
      .map((res: any) =>
      }
    );

  }*/
  storeOrders() {
    return this._http.post('http://localhost:1548/api/PostMenu',
      this.ourOffersService.getOrderedItemsList());
  }

}
