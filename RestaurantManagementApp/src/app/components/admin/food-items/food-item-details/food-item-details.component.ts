import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {FoodItem} from '../../../../models/food-item.model';
import {Inventory} from '../../../../models/inventory.model';
import {TableDataStorageService} from '../../../../services/data-storage/table-data-storage.service';
import {FoodItemDataStorageService} from '../../../../services/data-storage/food-item-data-storage.service';

@Component({
  selector: 'app-list-details',
  templateUrl: './food-item-details.component.html',
  styleUrls: ['./food-item-details.component.scss']
})
export class FoodItemDetailsComponent implements OnInit {
  isDisabled = false;
  rootUrl = '';
  imageUrl = 'assets/noImage.png';

  inventories: Inventory[] = [];
  foodItem: FoodItem;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private tableDataStorageService: TableDataStorageService,
              private foodItemDataStorageService: FoodItemDataStorageService) { }

  ngOnInit() {
    this.rootUrl = this.tableDataStorageService.rootUrl + '/Content/FoodItemImages/';
    this.route.data.
    subscribe(
      (data: Data) => {
        this.foodItem = data['foodItem'];
        this.inventories = data['inventories'];
        this.setFoodItemImage();

        if (this.foodItem === undefined || this.foodItem === null) {
          this.toastr.errorToastr('Item not found', 'Error');
          this.router.navigate(['admin/food-items']);
        }
      }
    );
  }


  setFoodItemImage() {
    if (this.foodItem.FoodItemImageName === null || this.foodItem.FoodItemImageName === '' ) {
      this.foodItem.FoodItemImageName = this.imageUrl;
    } else {
      this.foodItem.FoodItemImageName =  this.rootUrl + this.foodItem.FoodItemImageName;
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
    this.foodItemDataStorageService.deleteFoodItem(this.foodItem.Id).subscribe(
      (data: any) => {

        if (data.StatusText !== 'Success') {
          this.isDisabled = false;
          this.toastr.errorToastr(data.StatusText, 'Error');
          return;
        }

        this.toastr.successToastr('Removed from shop', 'Success');
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
