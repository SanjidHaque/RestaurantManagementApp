import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import {OurOffersService} from '../../../../our-offers/our-offers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FoodItems} from '../../../../shared/food-item.model';
import {DataStorageService} from '../../../../shared/data-storage.service';
import {OurOffers} from '../../../../our-offers/our-offers.model';
import {Ingredients} from '../../../../shared/ingredients.model';
import {Popup} from 'ng2-opd-popup';
@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit {

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
  /*  this._dataStorageService.getMenu()
      .subscribe(
        (Menu: OurOffers ) => {
          this._ourOfferService.FoodItem = Menu.FoodItems;
        });*/
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
    this.router.navigate(['admin/food-item/inventory-list-view']);
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

    this.router.navigate(['admin/food-item/inventory-list-view']);
    this.popup.hide();
  }

  cancelEvent() {
    this.popup.hide();
  }
  deleteFoodItem() {
    this.popup.options = {
      header: 'Delete This Item?',
      color: '#760000', // red, blue....
      widthProsentage: 50, // The with of the popou measured by browser width
      animationDuration: 1, // in seconds, 0 = no animation
      showButtons: true, // You can hide this in case you want to use custom buttons
      confirmBtnContent: 'Confirm', // The text on your confirm button
      cancleBtnContent: 'Cancel', // the text on your cancel button
      confirmBtnClass: 'btn btn-default', // your class for styling the confirm button
      cancleBtnClass: 'btn btn-default', // you class for styling the cancel button
      animation: 'bounceIn' // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    };
    this.popup.show();
  }

}
