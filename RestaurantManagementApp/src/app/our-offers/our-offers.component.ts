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
import {element} from 'protractor';
import { Inject} from '@angular/core';
import {Popup} from 'ng2-opd-popup';


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
              private popup: Popup
  ) {
    this.Menu = new OurOffers();
    this.uuidCodeOne = this.uuid.v1();
  }


  ngOnInit() {
    this.orderedItems = this._ourOfferService.getOrderedItemsList();
    this.grandTotal = this._ourOfferService.TotalPrice;
    this.quantity += this._ourOfferService.totalQuantity;
  }
  ngDoCheck() {
    this.orderedItems = this._ourOfferService.getOrderedItemsList();
    this.grandTotal = this._ourOfferService.TotalPrice;
  }




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
    /*let orderId = this._ourOfferService.uuidCodeOne;
    this.onCheck  = 1;
    this.orderedItems = this._ourOfferService.orderedItems;
    let totalPrice = this._ourOfferService.TotalPrice;
    let orderStatus = 0;
    this.orders = new Order(orderId, this.orderedItems, totalPrice, orderStatus);
    this._ourOfferService.addToOrderedList(this.orders);
    this._dataStorageService.storeOrders()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );*/
    this.router.navigate(['payment']);

  }




  DiscardOrder() {
    this.popup.options = {
      header: 'Destroy Current Order?',
      color: '#760000', // red, blue....
      widthProsentage: 40, // The with of the popou measured by browser width
      animationDuration: 1, // in seconds, 0 = no animation
      showButtons: true, // You can hide this in case you want to use custom buttons
      confirmBtnContent: 'Confirm', // The text on your confirm button
      cancleBtnContent: 'Cancel', // the text on your cancel button
      confirmBtnClass: 'btn btn-default', // your class for styling the confirm button
      cancleBtnClass: 'btn btn-default', // you class for styling the cancel button
      animation: 'bounceIn' // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    };
    this.popup.show();
  }

  ConfirmEvent() {
    this._ourOfferService.clearOrders();
    this._ourOfferService.TotalPrice = 0;
    this._ourOfferService.totalQuantity = 0;
    this.popup.hide();
  }

  CancelEvent() {
    this.popup.hide();
  }
}
