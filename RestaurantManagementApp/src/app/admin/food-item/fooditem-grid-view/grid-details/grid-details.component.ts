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

  FoodItemList: FoodItems[] = [];
  Ingredients: Ingredients[] = [];
  FoodItem: FoodItems;
  foodItemId: string;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private popup: Popup,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _http: Http) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = params['id'];
        }
      );
  }

  ngOnInit() {
    this.route.data.
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
        //  this.Ingredients = this.FoodItemList[i].Ingredients;
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
    this._dataStorageService.deleteFoodItem(this.FoodItem);
    for (let i = 0; i < this.FoodItemList.length; i++) {
      if (this.FoodItemList[i].Id === this.foodItemId) {
        this.FoodItemList.splice(i, 1);
        this._ourOfferService.FoodItem.splice(i, 1);
      }
    }

    this.router.navigate(['admin/food-item/grid-view']);
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
