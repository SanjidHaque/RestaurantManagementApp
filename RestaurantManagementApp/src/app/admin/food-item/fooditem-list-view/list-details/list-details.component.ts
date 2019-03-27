import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../../../../services/our-offers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FoodItem} from '../../../../models/food-item.model';
import {DataStorageService} from '../../../../services/data-storage.service';
import {Ingredients} from '../../../../models/ingredients.model';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit {

  rootUrl = '';
  imageUrl = 'assets/noImage.png';
  FoodItemList: FoodItem[] = [];
  Ingredients: Ingredients[] = [];
  FoodItem: FoodItem;
  foodItemId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private ourOffersService: OurOffersService,
             ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = params['id'];
        }
      );
  }

  ngOnInit() {
    this.rootUrl = this.dataStorageService.rootUrl + '/Content/';
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.ourOffersService.foodItems = data['foodItems'];
      }
    );
    this.FoodItemList = this.ourOffersService.foodItems;
    this.ourOffersService.foodItemsChanged
      .subscribe(
        (FoodItem: FoodItem[]) => {
          this.FoodItemList = FoodItem;
        }
      );
    for (let i = 0; i < this.FoodItemList.length; i++) {
      if (this.FoodItemList[i].Id === this.foodItemId) {
        this.FoodItem = this.FoodItemList[i];
        if ( this.FoodItem.FoodItemImageName === null || this.FoodItem.FoodItemImageName === '' ) {
          this.FoodItem.FoodItemImageName = this.imageUrl;
        } else {
          this.FoodItem.FoodItemImageName =  this.rootUrl + this.FoodItem.FoodItemImageName;
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
    this.dataStorageService.deleteFoodItem(this.FoodItem).subscribe(
      (data: any) => {
        for (let i = 0; i < this.FoodItemList.length; i++) {
          if (this.FoodItemList[i].Id === this.foodItemId) {
            this.ourOffersService.foodItems.splice(i, 1);
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
