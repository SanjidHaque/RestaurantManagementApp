import {DataStorageService} from '../shared/data-storage.service';
import {OurOffersService} from '../our-offers/our-offers.service';
import {OrderedItems} from '../shared/ordered-items.model';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {Order} from '../shared/order.model';
import { Response } from '@angular/http';
import { Uuid } from 'ng2-uuid';
import {Subscription} from 'rxjs/Subscription';


import {SetMenus} from '../shared/set-menu.model';
import {OurOffers} from '../our-offers/our-offers.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ChefServiceService} from '../chef/chef-service.service';


@Component({
  selector: 'app-food-cart',
  templateUrl: './food-cart.component.html',
  styleUrls: ['./food-cart.component.scss']
})
export class FoodCartComponent implements OnInit {
  public grandTotal: number;
  public orderedItems: OrderedItems[];
  public orders: Order;
  checkOrder = false;
  foodItemCount = 0;
  setMenuCount = 0;

  uuidCodeOne = '';
  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private _chefService: ChefServiceService,
              private uuid: Uuid,
              private route: ActivatedRoute,
              private router: Router
              ) {
    this.uuidCodeOne = this.uuid.v1();
  }

  ngOnInit() {
   this.orderedItems = this._ourOfferService.getOrderedItemsList();
   this.grandTotal = this._ourOfferService.TotalPrice;
  }
f() {
    for ( let i = 0; i< this.orderedItems.length; i++) {
      if(this.orderedItems[i].FoodItemName != null) {
        return this.foodItemCount ++;
      }
    }
}

  s() {
    for ( let i = 0; i< this.orderedItems.length; i++) {
      if(this.orderedItems[i].SetMenuName != null) {
        return this.setMenuCount ++;
      }
    }
  }

  AddToOrderedList() {

    let orderId = this._ourOfferService.uuidCodeOne;
    this.orderedItems = this._ourOfferService.orderedItems;
    let totalPrice = this._ourOfferService.TotalPrice;
    let isServed = false;
    const order = new Order(orderId, this.orderedItems, totalPrice, isServed);
    this._ourOfferService.addToOrderedList(order);
    this._dataStorageService.storeOrders()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
    // this.orders = this._dataStorageService.getOrders();
    this.router.navigate(['checking-orders'], {relativeTo: this.route});
    this.checkOrder = this._chefService.orderAccepted;
  }

  /*saveOrders() {
    this._dataStorageService.storeOrders()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );*/
//  }


}
