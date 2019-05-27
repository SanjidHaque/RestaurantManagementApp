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
        for (let k = 0; k < foodItems[j].Ingredients.length; k++ ) {

          const inventoryQuantity =  foodItems[j].Ingredients[k].Quantity;
          const totalQuantity = inventoryQuantity * quantity;
          const inventoryId = foodItems[j].Ingredients[k].InventoryId;

          for (let l = 0; l < inventories.length; l++) {
            if (inventories[l].Id === inventoryId) {
              if (inventories[l].RemainingQuantity < totalQuantity ) {
                this.toastr.errorToastr('Insufficient inventories', 'Error', {
                  toastTimeout: 10000,
                  newestOnTop: true,
                  showCloseButton: true
                });
                return false;
              }
            }
          }
        }
        return true;
      }
    }
  }


  deductInventories(foodItem: FoodItem, inventories: Inventory[], foodItemQuantity: number) {
    for (let i = 0; i < foodItem.Ingredients.length; i++) {
      const totalQuantity = foodItem.Ingredients[i].Quantity *  foodItemQuantity;
      const inventory = inventories.find(x => x.Id === foodItem.Ingredients[i].InventoryId);
      if (inventory === null || inventory === undefined)  {
        this.toastr.errorToastr('Related inventories may not found', 'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return false;
      }
      inventory.RemainingQuantity -= totalQuantity;
    }
    return true;
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


