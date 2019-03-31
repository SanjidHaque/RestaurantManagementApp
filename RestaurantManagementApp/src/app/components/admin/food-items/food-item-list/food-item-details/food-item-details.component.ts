import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FoodItem} from '../../../../../models/food-item.model';
import {Ingredients} from '../../../../../models/ingredients.model';
import {PointOfSaleService} from '../../../../../services/point-of-sale.service';
import {FoodItemDataStorageService} from '../../../../../services/food-item-data-storage.service';
import {TableDataStorageService} from '../../../../../services/table-data-storage.service';

@Component({
  selector: 'app-list-details',
  templateUrl: './food-item-details.component.html',
  styleUrls: ['./food-item-details.component.scss']
})
export class FoodItemDetailsComponent implements OnInit {

  rootUrl = '';
  imageUrl = 'assets/noImage.png';
  foodItems: FoodItem[] = [];
  ingredients: Ingredients[] = [];
  foodItem: FoodItem;
  foodItemId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tableDataStorageService: TableDataStorageService,
              private foodItemDataStorageService: FoodItemDataStorageService,
              private pointOfSaleService: PointOfSaleService,
             ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = params['inventoryId'];
        }
      );
  }

  ngOnInit() {
    this.rootUrl = this.tableDataStorageService.rootUrl + '/Content/FoodItemImage';
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.pointOfSaleService.foodItems = data['foodItems'];
      }
    );
    this.foodItems = this.pointOfSaleService.foodItems;
    this.pointOfSaleService.foodItemsChanged
      .subscribe(
        (foodItem: FoodItem[]) => {
          this.foodItems = foodItem;
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
    this.foodItemDataStorageService.deleteFoodItem(this.foodItemId).subscribe(
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
