import { Component, OnInit } from '@angular/core';
import {FoodItems} from '../../../shared/food-item.model';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../../shared/data-storage.service';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {Http} from '@angular/http';
import {OurOffers} from '../../../our-offers/our-offers.model';

@Component({
  selector: 'app-fooditem-list-view',
  templateUrl: './fooditem-list-view.component.html',
  styleUrls: ['./fooditem-list-view.component.scss']
})
export class FooditemListViewComponent implements OnInit {
  FoodItem: FoodItems[] = [];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _http: Http) { }

  ngOnInit() {
    /*this._dataStorageService.getFoodItems()
      .subscribe(
        (foodItems: FoodItems[] ) => {
          this._ourOfferService.FoodItem = foodItems;
        });*/
    this.route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this._ourOfferService.FoodItem = data['foodItems'];
      }
    );

    this.FoodItem = this._ourOfferService.FoodItem;
    this._ourOfferService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );
  }
  viewDetails(foodItem: FoodItems) {
    const foodItemId =  foodItem.Id;
    this.router.navigate(['admin/food-item/list-details', foodItemId]);
  }

}
