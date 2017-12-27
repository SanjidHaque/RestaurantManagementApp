import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../our-offers/our-offers.service';
import {OrderedItems} from '../shared/ordered-items.model';

@Component({
  selector: 'app-food-cart',
  templateUrl: './food-cart.component.html',
  styleUrls: ['./food-cart.component.scss']
})
export class FoodCartComponent implements OnInit {
  public orderedItems: OrderedItems[];
  constructor(private _ourOfferService: OurOffersService) { }

  ngOnInit() {
   this.orderedItems = this._ourOfferService.getOrderedItemsList();
  }

}
