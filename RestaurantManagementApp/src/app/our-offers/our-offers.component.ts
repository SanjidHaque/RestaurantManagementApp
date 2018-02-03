import {Component, DoCheck, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { Response } from '@angular/http';
import {OurOffersService} from './our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {OurOffers} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';
import {OrderedItems} from '../shared/ordered-items.model';
import {Order} from '../shared/order.model';
import { Uuid } from 'ng2-uuid';

@Component({
  selector: 'app-our-offers',
  templateUrl: './our-offers.component.html',
  styleUrls: ['./our-offers.component.scss']
})
export class OurOffersComponent implements OnInit, DoCheck {
    Menu: OurOffers;
    subscription: Subscription;
    toCheckOut = false;
    quantity: number = 0;
    uuidCodeOne = '';
    onCheck = 0;

  public grandTotal: number;
  public orderedItems: OrderedItems[];
  public orders: Order;
  checkOrder = false;
  foodItemCount = 0;
  setMenuCount =  0;
  public loading = false;

  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid,

  ) {
    this.Menu = new OurOffers();
    this.uuidCodeOne = this.uuid.v1();


  }

    /*this._ourOfferService.getOurOffers()
        .subscribe(
          responseToSetMenu => this.setMenus = responseToSetMenu
        );*/

  ngOnInit() {


    this.orderedItems = this._ourOfferService.getOrderedItemsList();
    this.grandTotal = this._ourOfferService.TotalPrice;
    this.quantity += this._ourOfferService.totalQuantity;
  }
  ngDoCheck() {
    this.orderedItems = this._ourOfferService.getOrderedItemsList();
    this.grandTotal = this._ourOfferService.TotalPrice;
  }

 /* saveOrders() {
    this._dataStorageService.storeOrders()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }*/




  checkFoodItemCount() {
    for ( let i = 0; i< this.orderedItems.length; i++) {
      if(this.orderedItems[i].FoodItemName != null) {
        this.foodItemCount += 1;
      }
    }
    return this.foodItemCount
  }

  checkSetMenuCount() {
    for ( let i = 0; i< this.orderedItems.length; i++) {
      if(this.orderedItems[i].SetMenuName != null) {
        this.setMenuCount += 1;
      }
    }
    return this.setMenuCount;
  }

  goToAllCategories() {
    this.router.navigate(['our-offers/all-categories']);
  }
  goToSetMenus() {
    this.router.navigate(['our-offers/set-menu']);
  }

  goToRegulars() {
    this.router.navigate(['our-offers/regulars']);
  }
  AddToOrderedList() {
    let orderId = this._ourOfferService.uuidCodeOne;
    this.onCheck  = 1;
    this.orderedItems = this._ourOfferService.orderedItems;
    let totalPrice = this._ourOfferService.TotalPrice;
    let orderStatus = 0;
    const order = new Order(orderId, this.orderedItems, totalPrice, orderStatus);
    this._ourOfferService.addToOrderedList(order);
    this._dataStorageService.storeOrders()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  /*
      this._dataStorageService.getMenu()
        .subscribe((Menu: OurOffers ) => {
        this.Menu = Menu;
      });

      this.subscription = this._ourOfferService.menuChanged
        .subscribe(
          (Menu: OurOffers) => {
            this.Menu = Menu;
          }
        );*/

}
