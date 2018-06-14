import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../../../../our-offers/our-offers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FoodItems} from '../../../../shared/food-item.model';
import {DataStorageService} from '../../../../shared/data-storage.service';
import {Ingredients} from '../../../../shared/ingredients.model';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit {

  rootUrl = 'http://localhost:1548/Content/';
  imageUrl = 'assets/noImage.png';
  FoodItemList: FoodItems[] = [];
  Ingredients: Ingredients[] = [];
  FoodItem: FoodItems;
  foodItemId: string;
  constructor(private _route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
             ) {
    this._route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = params['id'];
        }
      );
  }

  ngOnInit() {
    this._route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this._ourOfferService.FoodItem = data['foodItems'];
      }
    );
    this.FoodItemList = this._ourOfferService.FoodItem;
    this._ourOfferService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItemList = FoodItem;
        }
      );
    for (let i = 0; i < this.FoodItemList.length; i++) {
      if (this.FoodItemList[i].Id === this.foodItemId) {
        this.FoodItem = this.FoodItemList[i];
        if ( this.FoodItem.FoodItemImage === null || this.FoodItem.FoodItemImage === '' ) {
          this.FoodItem.FoodItemImage = this.imageUrl;
        } else {
          this.FoodItem.FoodItemImage =  this.rootUrl + this.FoodItem.FoodItemImage;
        }
      }
    }
  }
  goBack() {
    this.router.navigate(['admin/food-item/list-view']);
  }
  edit() {
    this.router.navigate(['admin/food-item/edit-food-item', this.foodItemId]);
  }

  confirmEvent() {
    this._dataStorageService.deleteFoodItem(this.FoodItem).subscribe(
      (data: any) => {
        for (let i = 0; i < this.FoodItemList.length; i++) {
          if (this.FoodItemList[i].Id === this.foodItemId) {
            this._ourOfferService.FoodItem.splice(i, 1);
          }
        }
        this.router.navigate(['admin/food-item/list-view']);
      }
    );
  }

  deleteFoodItem() {
    const dialog = confirm('Delete this item?\n' +
      'You will lose any kind of data associated with the current item!');
    if (dialog === true) {
      this.confirmEvent();
    }
  }

  changeImage() {
    this.router.navigate(['admin/food-item/edit-food-item-image', this.foodItemId]);
  }
}
