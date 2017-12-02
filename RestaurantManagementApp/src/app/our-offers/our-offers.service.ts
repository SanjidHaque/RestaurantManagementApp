import { Response} from '@angular/http';
import {Http} from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import {OurOffers} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';
import {OrderedItems} from '../shared/ordered-items.model';


@Injectable()
export class OurOffersService {
  public menuChanged = new Subject<OurOffers>();
  public orderedItemsChanged = new Subject<OrderedItems[]>();
  public menu: OurOffers;
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
}


