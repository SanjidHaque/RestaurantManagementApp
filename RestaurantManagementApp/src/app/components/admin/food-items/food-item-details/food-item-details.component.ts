import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {FoodItem} from '../../../../models/food-item.model';
import {Ingredients} from '../../../../models/ingredients.model';
import {TableDataStorageService} from '../../../../services/table-data-storage.service';
import {FoodItemDataStorageService} from '../../../../services/food-item-data-storage.service';
import {Inventory} from '../../../../models/inventory.model';

@Component({
  selector: 'app-list-details',
  templateUrl: './food-item-details.component.html',
  styleUrls: ['./food-item-details.component.scss']
})
export class FoodItemDetailsComponent implements OnInit {

  rootUrl = '';
  imageUrl = 'assets/noImage.png';

  foodItems: FoodItem[] = [];
  inventories: Inventory[] = [];

  ingredients: Ingredients[] = [];
  foodItem: FoodItem;
  foodItemId: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tableDataStorageService: TableDataStorageService,
              private foodItemDataStorageService: FoodItemDataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = +params['foodItemId'];
        }
      );
  }

  ngOnInit() {
    this.rootUrl = this.tableDataStorageService.rootUrl + '/Content/FoodItemImage';
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.foodItems = data['foodItems'];
        this.inventories = data['inventories'];
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

  getIngredientInfo(inventoryId: number, specifier: string) {
    const inventory = this.inventories.find(x => x.Id === inventoryId);
    if (inventory !== undefined || inventory !== null) {
      if (specifier === 'Name') {
        return inventory.Name;
      }
      if (specifier === 'Unit') {
        return inventory.Unit;
      }
      if (specifier === 'Price') {
        return inventory.AveragePrice;
      }
    }
    return '';
  }

  confirmEvent() {
    this.foodItemDataStorageService.deleteFoodItem(this.foodItemId).subscribe(
      (data: any) => {
        this.router.navigate(['admin/food-items']);
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
}
