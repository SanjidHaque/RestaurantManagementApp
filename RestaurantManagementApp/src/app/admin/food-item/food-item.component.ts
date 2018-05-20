import { Component, OnInit } from '@angular/core';
import {Inventory} from '../../shared/inventory.model';
import {FoodItems} from '../../shared/food-item.model';
import {OurOffersService} from '../../our-offers/our-offers.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.scss']
})
export class FoodItemComponent implements OnInit {
  imageUrl = 'assets/noImage.png';
  rootUrl = 'http://localhost:1548/Content/';
  constructor(private _route: ActivatedRoute,
              private _ourOfferService: OurOffersService ) { }

  ngOnInit() {
    /*this._route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this._ourOfferService.FoodItem = data['foodItems'];
      }
    );
    this._route.data.
    subscribe(
      ( data: Inventory[]) => {
        this._ourOfferService.inventory = data['inventories'];
      }
    );
    for (let i = 0; i < this._ourOfferService.FoodItem.length; i++) {
      if (this._ourOfferService.FoodItem[i].FoodItemImage === null
        ||
        this._ourOfferService.FoodItem[i].FoodItemImage === '' ) {
        this._ourOfferService.FoodItem[i].FoodItemImage = this.imageUrl;
      }
      this._ourOfferService.FoodItem[i].FoodItemImage
        =
        this.rootUrl + this._ourOfferService.FoodItem[i].FoodItemImage;
    }*/
  }


}
