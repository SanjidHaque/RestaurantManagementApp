import { Response} from '@angular/http';
import {Http} from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import {OurOffers} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';
import {OrderedItems} from '../shared/ordered-items.model';
import {forEach} from '@angular/router/src/utils/collection';


@Injectable()
export class OurOffersService {
  public TotalPrice: number = 0;
  public menuChanged = new Subject<OurOffers>();
  public orderedItemsChanged = new Subject<OrderedItems[]>();
  public menu: OurOffers;
  public totalQuantity : number = 0;
  public orderedItems: OrderedItems[] = [];
  constructor() {
  }

  setOurOffers(menu: OurOffers) {
    this.menu = menu;
    this.menuChanged.next(this.menu/*.slice()*/);
  }
  getOurOffers() {
      return this.menu/*.slice()*/;
  }
  getOrderedItemsList() {
    return this.orderedItems.slice();
  }

  addToOrderedItemsList(orderedItems: OrderedItems) {
    this.orderedItems.push(orderedItems);
    this.orderedItemsChanged.next(this.orderedItems.slice());
  }

  grandTotalPrice(price: number){
     this.TotalPrice = Number.parseInt(price.toString()) + Number.parseInt(this.TotalPrice.toString());
     return this.TotalPrice;
  }

  subTotaLPrice(price: number, quantity: number) {
    // this.totalQuantity =  Number.parseInt(this.totalQuantity .toString()) + Number.parseInt(quantity.toString());
    let subPrice = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
      return subPrice;
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

  increaseOnExisting(setMenuId: number, quantity: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if (this.orderedItems[i].SetMenuId === setMenuId) {
        this.orderedItems[i].Quantity =
          Number.parseInt(this.orderedItems[i].Quantity.toString())
          + Number.parseInt(quantity.toString());
          /*this.orderedItems[i].Quantity + quantity;*/
      }
    }
  }
}


