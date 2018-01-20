import {Injectable, OnInit} from '@angular/core';
import { Http, Response } from '@angular/http';
import {OurOffersService} from '../our-offers/our-offers.service';
import {OurOffers} from '../our-offers/our-offers.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Order} from './order.model';
@Injectable()
export class DataStorageService {

  public order: Order;
 private _url = 'assets/menu-from-api.json';
 //      private _url = 'http://localhost:1548/api/menu';
  constructor(private _http: Http,
              private _ourOffersService: OurOffersService) {
  }

 /* ngOnInit() {
    this.Order = this._ourOffersService.orders;
  }*/
  getMenu() {
    return this._http.get(this._url)
      .map(
        (response: Response) => {
           const menus: OurOffers = response.json();
           console.log(menus);
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
     this._ourOffersService.orders);
  }

  acceptOrders() {
    return this._http.post('http://localhost:1548/api/AcceptOrders',
      this._ourOffersService.getAcceptedOrder() ).map(
        res => res.json())
      .catch((error: any) => Observable.throw(error.json().error ||
      'Server error'))
      .subscribe();

  }


  getOrders() {
    return this._http.get('http://localhost:1548/api/GetOrders')
      .map(
        (response: Response) => {
          const orders: Order = response.json();
          return orders;
        }
      );
  }


}
