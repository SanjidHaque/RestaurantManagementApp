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
  public acceptedOrder: Order;
  public rejectedOrder: Order;
  public setMenuSubTotal = 0;
  public foodItemSubTotal = 0;
  constructor(private uuid: Uuid
            ) {    this.uuidCodeOne = this.uuid.v1();
  }

  removeFromSetMenuCart(setMenuId: number, quantity: number, subTotal: number) {

    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
        if ( this.orderedItems[i].SetMenuId === setMenuId) {
          this.orderedItems[i].SetMenuQuantity =
            this.orderedItems[i].SetMenuQuantity
            - quantity;

          this.orderedItems[i].SetMenuSubTotal =
            this.orderedItems[i].SetMenuSubTotal
            - subTotal;
          this.TotalPrice -= Number.parseInt(subTotal.toString());
          return this.orderedItems[i].SetMenuQuantity;
        }
     }
  }

  removeFromFoodItemCart(foodItemId: number, quantity: number, subTotal: number) {

    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if ( this.orderedItems[i].FoodItemId === foodItemId) {
        this.orderedItems[i].FoodItemQuantity =
          this.orderedItems[i].FoodItemQuantity
          - quantity;

        this.orderedItems[i].FoodItemSubTotal =
          this.orderedItems[i].FoodItemSubTotal
          - subTotal;
        this.TotalPrice -= Number.parseInt(subTotal.toString());
        return this.orderedItems[i].FoodItemQuantity;
      }
    }
  }


  getOrderedItemsList() {
    return this.orderedItems.slice();
  }

  getAccepted(order: Order) {
    this.acceptedOrder = order;
  }
  getRejected(order: Order) {
    this.rejectedOrder = order;
  }
  getAcceptedOrder() {
    return this.acceptedOrder;
  }

  getRejectedOrder() {
    return this.rejectedOrder;
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

  SetMenuSubTotaLPrice(price: number, quantity: number) {
    this.setMenuSubTotal = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
    return this.setMenuSubTotal;
  }

  FoodItemSubTotaLPrice(price: number, quantity: number) {
    this.foodItemSubTotal = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
    return this.foodItemSubTotal;
  }

   checkExistingSetMenu(setMenuId: number) {
     for (let i = 0 ; i < this.orderedItems.length; i++ ) {
       if (this.orderedItems[i].SetMenuId === setMenuId) {
         return true;
       }
     }
  }

  checkExistingFoodItem(foodItemId: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if (this.orderedItems[i].FoodItemId === foodItemId) {
        return true;
      }
    }
  }

  increaseOnExistingSetMenu(setMenuId: number, quantity: number, subTotal: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {

      if (this.orderedItems[i].SetMenuId === setMenuId) {

        this.orderedItems[i].SetMenuQuantity =
          Number.parseInt(this.orderedItems[i].SetMenuQuantity.toString())
          + Number.parseInt(quantity.toString());

        this.orderedItems[i].SetMenuSubTotal =
          Number.parseInt(this.orderedItems[i].SetMenuSubTotal.toString())
          + Number.parseInt(this.setMenuSubTotal.toString());
      }
    }
  }

  increaseOnExistingFoodItem(foodItemId: number, quantity: number, subTotal: number ) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {

      if (this.orderedItems[i].FoodItemQuantity === foodItemId) {

        this.orderedItems[i].FoodItemQuantity =
          Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString())
          + Number.parseInt(quantity.toString());

        this.orderedItems[i].FoodItemSubTotal =
          Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString())
          + Number.parseInt(this.foodItemSubTotal.toString());
      }
    }
  }
}


