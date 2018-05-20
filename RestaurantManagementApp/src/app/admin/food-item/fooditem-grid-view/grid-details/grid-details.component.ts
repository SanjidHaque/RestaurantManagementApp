import { Component, OnInit } from '@angular/core';
import {FoodItems} from '../../../../shared/food-item.model';
import {Ingredients} from '../../../../shared/ingredients.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Popup} from 'ng2-opd-popup';
import {DataStorageService} from '../../../../shared/data-storage.service';
import {OurOffersService} from '../../../../our-offers/our-offers.service';
import {Http} from '@angular/http';

@Component({
  selector: 'app-grid-details',
  templateUrl: './grid-details.component.html',
  styleUrls: ['./grid-details.component.scss']
})
export class GridDetailsComponent implements OnInit {
  rootUrl = 'http://localhost:1548/Content/';
  imageUrl = 'assets/noImage.png';
  FoodItemList: FoodItems[] = [];
  Ingredients: Ingredients[] = [];
  FoodItem: FoodItems;
  foodItemId: string;
  constructor(private _route: ActivatedRoute,
              private router: Router,
              private popup: Popup,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _http: Http) {
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
    this.router.navigate(['admin/food-item/grid-view']);
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

        this.router.navigate(['admin/food-item/grid-view']);
      }
    );
    this.popup.hide();
  }

  cancelEvent() {
    this.popup.hide();
  }
  deleteFoodItem() {
    this.popup.options = {
      header: 'Delete This Item?',
      color: '#760000',
      widthProsentage: 50,
      animationDuration: 1,
      showButtons: true,
      confirmBtnContent: 'Confirm',
      cancleBtnContent: 'Cancel',
      confirmBtnClass: 'btn btn-default',
      cancleBtnClass: 'btn btn-default',
      animation: 'bounceIn'
    };
    this.popup.show();
  }
  changeImage() {
    this.router.navigate(['admin/food-item/edit-food-item-image', this.foodItemId]);
  }

}
