import {Component, DoCheck, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {Order} from '../shared/order.model';
import {Subscription} from 'rxjs/Subscription';
import {OurOffersService} from '../our-offers/our-offers.service';
import {Http} from '@angular/http';
import {ChefServiceService} from './chef-service.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-chef',
  templateUrl: './chef.component.html',
  styleUrls: ['./chef.component.scss']
})
export class ChefComponent implements OnInit, DoCheck {
  subscription: Subscription;
  Orders: Order[] = [];
  MyOrders: Order[];

  constructor(private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _chefService: ChefServiceService,
              private _http: Http,
              private route: ActivatedRoute,
              private router: Router) {
  }


  ngOnInit() {

    this._dataStorageService.getOrders()
      .subscribe(
        (Orders: Order[]) => {
          this.Orders = Orders;
        }
      );
   /* this.subscription = this._ourOfferService.ordersChanged
      .subscribe(
        (Orders: Order) => {
          this.Orders = Orders;
        }
      );*/
   /* this.MyOrders.filter((myOrder)=>{
      return myOrder.OnChef === false;
    })*/
  }
  ngDoCheck() {
  }

  orderAccepted(order: Order) {
     order.OrderStatus = 1;
     this._ourOfferService.getAccepted(order) ;
    this._dataStorageService.acceptOrders();
  }

  orderRejected(order: Order) {
    order.OrderStatus = 2;
    this._ourOfferService.getRejected(order) ;
    this._dataStorageService.rejectOrders();
  }
}
