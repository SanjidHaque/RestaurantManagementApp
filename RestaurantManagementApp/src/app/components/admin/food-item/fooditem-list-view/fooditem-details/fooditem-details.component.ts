import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FoodItem} from '../../../../../models/food-item.model';
import {Ingredients} from '../../../../../models/ingredients.model';
import {DataStorageService} from '../../../../../services/data-storage.service';
import {PointOfSaleService} from '../../../../../services/point-of-sale.service';

@Component({
  selector: 'app-list-details',
  templateUrl: './list-details.component.html',
  styleUrls: ['./list-details.component.scss']
})
export class ListDetailsComponent implements OnInit {

  rootUrl = '';
  imageUrl = 'assets/noImage.png';
  foodItems: FoodItem[] = [];
  ingredients: Ingredients[] = [];
  foodItem: FoodItem;
  foodItemId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private pointOfSaleService: PointOfSaleService,
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
        this.pointOfSaleService.foodItems = data['foodItems'];
      }
    );
    this.foodItems = this.pointOfSaleService.foodItems;
    this.pointOfSaleService.foodItemsChanged
      .subscribe(
        (FoodItem: FoodItem[]) => {
          this.foodItems = FoodItem;
        }
      );
    for (let i = 0; i < this.foodItems.length; i++) {
      if (this.foodItems[i].Id === this.foodItemId) {
        this.foodItem = this.foodItems[i];
        if ( this.foodItem.FoodItemImageName === null || this.foodItem.FoodItemImageName === '' ) {
          this.foodItem.FoodItemImageName = this.imageUrl;
        } else {
          this.foodItem.FoodItemImageName =  this.rootUrl + this.foodItem.FoodItemImageName;
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
    this.dataStorageService.deleteFoodItem(this.foodItem).subscribe(
      (data: any) => {
        for (let i = 0; i < this.foodItems.length; i++) {
          if (this.foodItems[i].Id === this.foodItemId) {
            this.pointOfSaleService.foodItems.splice(i, 1);
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
