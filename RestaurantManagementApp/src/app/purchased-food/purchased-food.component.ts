import {Component, Input, OnInit, Output} from '@angular/core';
import {FoodCartComponent} from '../food-cart/food-cart.component';
import {ActivatedRoute} from '@angular/router';
import {OurOffersService} from '../our-offers/our-offers.service';
import {OrderedItems} from '../shared/ordered-items.model';

@Component({
  selector: 'app-purchased-food',
  templateUrl: './purchased-food.component.html',
  styleUrls: ['./purchased-food.component.scss']
})
export class PurchasedFoodComponent implements OnInit {
  public PurchasedFoods: OrderedItems[];

  constructor(private route: ActivatedRoute,
              private _ourOffersService: OurOffersService) { }
  ngOnInit() {
    this.PurchasedFoods = this._ourOffersService.getOrderedItemsList();
  }

}
