import { Response} from '@angular/http';
import {Http} from '@angular/http';
import { Injectable } from '@angular/core';
import { Uuid } from 'ng2-uuid';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import {OurOffers} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';
import {OrderedItems} from '../shared/ordered-items.model';
import {forEach} from '@angular/router/src/utils/collection';
import {Order} from '../shared/order.model';


@Injectable()
export class OurOffersService {
  public uuidCodeOne = '';
  public TotalPrice = 0;
  // public TotalPriceChanged = new Subject<number>();
  public menuChanged = new Subject<OurOffers>();
  public orderedItemsChanged = new Subject<OrderedItems[]>();
  public ordersChanged = new Subject<Order>();
  public menu: OurOffers;
  public totalQuantity  = 0;
  public orderedItems: OrderedItems[] = [];
  public orders: Order;
  public chefOrder: Order;
  public subTotal = 0;
  constructor(private uuid: Uuid
            ) {    this.uuidCodeOne = this.uuid.v1();
  }

  /*getTotalPrice() {
    return this.TotalPriceChanged.next(this.TotalPrice);
  }*/

 /* setOurOffers(menu: OurOffers) {
    this.menu = menu;
    this.menuChanged.next(this.menu/!*.slice()*!/);
  }
  getOurOffers() {
      return this.menu/!*.slice()*!/;
  }*/
  getOrderedItemsList() {
    return this.orderedItems.slice();
  }

  getAccepted(order: Order) {
    this.chefOrder = order;
  }
  getOrdersList() {
    return this.orders;
  }
  getAcceptedOrder() {
    return this.chefOrder;
  }

  addToOrderedItemsList(orderedItems: OrderedItems) {
    this.orderedItems.push(orderedItems);
    this.orderedItemsChanged.next(this.orderedItems.slice());
  }

  addToOrderedList(order: Order) {
    this.orders = order;
    this.ordersChanged.next(order);
  }

  grandTotalPrice(price: number) {
     this.TotalPrice = Number.parseInt(price.toString()) + Number.parseInt(this.TotalPrice.toString());
     return this.TotalPrice;
  }

  subTotaLPrice(price: number, quantity: number) {
    //   this.totalQuantity =  Number.parseInt(this.totalQuantity .toString()) + Number.parseInt(quantity.toString());
    this.subTotal = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
    return this.subTotal;
  }

   checkExistingSetMenu(setMenuId: number) {
     for (let i = 0 ; i < this.orderedItems.length; i++ ) {

       if (this.orderedItems[i].SetMenuId === setMenuId) {
         return true;
       } /*else {
         this.checkExistingSetMenu(setMenuId);

        // return false;
       }*/
     }
  /*  for (let check of this.orderedItems)
    {
      let i = 0;
      if (check[i].SetMenuId === setMenuId) {
        return true;
      }
      else {
        this.checkExistingSetMenu(setMenuId);
        return false;
      }
    }*/
  }

  increaseOnExisting(setMenuId: number, quantity: number, subTotal: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {

      if (this.orderedItems[i].SetMenuId === setMenuId) {

        this.orderedItems[i].Quantity =
          Number.parseInt(this.orderedItems[i].Quantity.toString())
          + Number.parseInt(quantity.toString());

        this.orderedItems[i].SubTotal =
          Number.parseInt(this.orderedItems[i].SubTotal.toString())
          + Number.parseInt(this.subTotal.toString());
      }
    }
  }
}


