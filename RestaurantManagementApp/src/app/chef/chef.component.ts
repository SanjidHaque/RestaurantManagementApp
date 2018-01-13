import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {Order} from '../shared/order.model';
import {Subscription} from 'rxjs/Subscription';
import {OurOffersService} from '../our-offers/our-offers.service';
import {Http} from '@angular/http';
import {ChefServiceService} from './chef-service.service';

@Component({
  selector: 'app-chef',
  templateUrl: './chef.component.html',
  styleUrls: ['./chef.component.scss']
})
export class ChefComponent implements OnInit {
  // public orders: Order;
  subscription: Subscription;
  Orders: Order;
  chefOrder: Order;

  constructor(private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _chefService: ChefServiceService,
              private _http: Http) {
  }
  private headers: Headers;


  ngOnInit() {
    this.subscription = this._ourOfferService.ordersChanged
      .subscribe(
        (Orders: Order) => {
          this.Orders = Orders;
        }
      );
    this._dataStorageService.getOrders()
      .subscribe(
        (Orders: Order) => {
          this.Orders = Orders;
        }
      );

    // this.subscription = this._ourOfferService.menuChanged
    /* .subscribe(
       (Menu: OurOffers) => {
         this.Menu = Menu;
       }
     );
   /!*  this.Menu = this._ourOfferService.getOurOffers();*!/
   this._dataStorageService.getMenu()
     .subscribe((Menu: OurOffers ) => {
       this.Menu = Menu;
     });*/


  }

  orderAccepted(order: Order) {
    // this.chefOrder = order;
      // this.order = order;
     this._ourOfferService.getAccepted(order) ;
     this._dataStorageService.acceptOrders();
     this._chefService.orderAccepted = true;
     // return this._http.post('http://localhost:1548/api/AcceptOrders',
     //  this._dataStorageService.getOrders() );

  }
}
