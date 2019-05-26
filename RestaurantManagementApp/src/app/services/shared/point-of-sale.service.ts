import { Injectable } from '@angular/core';

import {FoodItem} from '../../models/food-item.model';
import {ToastrManager} from 'ng6-toastr-notifications';
import {Inventory} from '../../models/inventory.model';
import {OrderedItem} from '../../models/ordered-item.model';


@Injectable()
export class PointOfSaleService {
  constructor(private toastr: ToastrManager) { }



  checkIfOrderedItemExist(foodItemId: number, orderedItems: OrderedItem[]) {
    for (let i = 0; i < orderedItems.length; i++) {
      if (orderedItems[i].FoodItemId === foodItemId) {
        return orderedItems[i];
      }
    }
    return null;
  }


  checkIfInventoryExists(quantity: number, foodItem: FoodItem, foodItems: FoodItem[], inventories: Inventory[]) {
    for (let j = 0; j < foodItems.length; j++) {

      if (foodItems[j].Id === foodItem.Id) {
        let check = 0;
        for (let k = 0; k < foodItems[j].Ingredients.length; k++ ) {

          const inventoryQuantity =  foodItems[j].Ingredients[k].Quantity;
          const totalQuantity = inventoryQuantity * quantity;
          const inventoryId = foodItems[j].Ingredients[k].InventoryId;

          for (let l = 0; l < inventories.length; l++) {
            if (inventories[l].Id === inventoryId) {
              if (inventories[l].RemainingQuantity > totalQuantity ) {
                check++;
              }
            }
          }
        }

        if (check < foodItems[j].Ingredients.length) {
          this.toastr.errorToastr('Insufficient inventories', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
        }
        break;
      }
    }
  }


  checkCartConditions(quantity: number) {
    if (quantity % 1 !== 0) {
      this.toastr.errorToastr('Value cannot be fractional', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return;
    }

    if (quantity <= 0) {
      this.toastr.errorToastr('Value cannot be negative or zero', 'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      return;
    }
  }

}


