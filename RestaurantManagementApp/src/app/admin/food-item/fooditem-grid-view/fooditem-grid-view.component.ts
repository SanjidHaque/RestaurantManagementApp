import {Component, DoCheck, OnInit} from '@angular/core';
import {FoodItems} from '../../../shared/food-item.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-fooditem-grid-view',
  templateUrl: './fooditem-grid-view.component.html',
  styleUrls: ['./fooditem-grid-view.component.scss']
})
export class FooditemGridViewComponent implements OnInit {

  imageUrl = 'assets/noImage.png';
  rootUrl = 'http://localhost:4202/Content/';
  public FoodItem: FoodItems[] = [];
  subscription: Subscription;
  total: number;
  constructor(private router: Router,
              private _route: ActivatedRoute,
              private _ourOfferService: OurOffersService,
            ) { }

  ngOnInit() {
    this._route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this._ourOfferService.FoodItem = data['foodItems'];
      }
    );
    this.FoodItem = this._ourOfferService.FoodItem;
    this.subscription = this._ourOfferService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );
    for (let i = 0; i < this.FoodItem.length; i++) {
      if (this.FoodItem[i].FoodItemImage === null || this.FoodItem[i].FoodItemImage === '' ) {
        this.FoodItem[i].FoodItemImage = this.imageUrl;
      } else {
        this.FoodItem[i].FoodItemImage =  this.rootUrl + this.FoodItem[i].FoodItemImage;
      }
    }
    this.total = this._ourOfferService.FoodItem.length;
  }



  viewDetails(foodItem: FoodItems) {
    const foodItemId =  foodItem.Id;
    this.router.navigate(['admin/food-item/grid-details', foodItemId]);
  }
}
