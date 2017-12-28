import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../our-offers/our-offers.service';
import {OrderedItems} from '../shared/ordered-items.model';
import {SetMenus} from '../shared/set-menu.model';
import {DataStorageService} from '../shared/data-storage.service';
import {OurOffers} from '../our-offers/our-offers.model';

@Component({
  selector: 'app-food-cart',
  templateUrl: './food-cart.component.html',
  styleUrls: ['./food-cart.component.scss']
})
export class FoodCartComponent implements OnInit {
  public grandTotal: number;
  public orderedItems: OrderedItems[];

  constructor(private _ourOfferService: OurOffersService) { }

  ngOnInit() {
   this.orderedItems = this._ourOfferService.getOrderedItemsList();
   this.grandTotal = this._ourOfferService.TotalPrice;
  }


}
