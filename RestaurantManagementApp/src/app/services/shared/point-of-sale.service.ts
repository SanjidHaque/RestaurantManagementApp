import { Injectable } from '@angular/core';

import {Subject} from 'rxjs';
import {OrderedItem} from '../../models/ordered-item.model';
import {Order} from '../../models/order.model';
import {Inventory} from '../../models/inventory.model';
import {FoodItem} from '../../models/food-item.model';
import {Table} from '../../models/table.model';
import {UUID} from 'angular2-uuid';
import {ToastrManager} from 'ng6-toastr-notifications';


@Injectable()
export class PointOfSaleService {
  uuidCodeOne = '';
  totalPrice = 0;
  totalQuantity  = 0;
  orderedItems: OrderedItem[] = [];
  orderedItemsChanged = new Subject<OrderedItem[]>();
  order: Order;
  orderChanged = new Subject<Order>();
  orders: Order[] = [];
  ordersChanged = new Subject<Order[]>();
  foodItemSubTotal = 0;
  foodItems: FoodItem[] = [];
  foodItemsChanged = new Subject<FoodItem[]>();
  inventories: Inventory[] = [];
  inventoriesChanged = new Subject<Inventory[]>();
  tables: Table[] = [];
  tablesChanged = new Subject<Table[]>();


  constructor(private toastr: ToastrManager) {
    this.uuidCodeOne = UUID.UUID();
  }

  clearOrders() {
    this.orderedItems = [];
  }

  removeFromFoodItemCart(foodItemId: number, quantity: number, subTotal: number) {

    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if ( this.orderedItems[i].FoodItemId === foodItemId) {
        if (this.orderedItems[i].FoodItemQuantity >= quantity) {
          this.orderedItems[i].FoodItemQuantity =
            this.orderedItems[i].FoodItemQuantity
            - quantity;

          this.orderedItems[i].TotalPrice =
            this.orderedItems[i].TotalPrice
            - subTotal;
          this.totalPrice -= Number.parseInt(subTotal.toString(), 2);
          this.totalQuantity -= Number.parseInt(quantity.toString(), 2);
          if (this.orderedItems[i].FoodItemQuantity === 0) {
            this.orderedItems.splice(i, 1);
          }
        }

      }
    }
  }

  checkIfOrderedItemExist(foodItemId: number, orderedItems: OrderedItem[]) {
    for (let i = 0; i < orderedItems.length; i++) {
      if (orderedItems[i].FoodItemId === foodItemId) {
        return orderedItems[i];
      }
    }
    return null;
  }


  getOrderedItemsList() {
    return this.orderedItems.slice();
  }

  deleteOrder(order: Order) {
    for (let i = 0; i < this.orders.length; i++ ) {
      if ( this.orders[i].Id === order.Id  ) {
        this.orders.splice(i, 1);
      }
    }
  }
  addToOrderedItemsList(orderedItems: OrderedItem) {
    this.orderedItems.push(orderedItems);
    this.orderedItemsChanged.next(this.orderedItems.slice());
  }

  addToOrderedList(order: Order) {
    this.order = order;
    this.orderChanged.next(order);
    this.orders.push(order);
    this.ordersChanged.next(this.orders.slice());
  }

  grandTotalPrice(price: number) {
     this.totalPrice = Number.parseInt(price.toString(), 2)
       + Number.parseInt(this.totalPrice.toString(), 2);
     return this.totalPrice;
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
        if (check < this.foodItems[j].Ingredients.length) {
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
  FoodItemSubTotalPrice(price: number, ore: number) {
    this.foodItemSubTotal = price * ore;
    return this.foodItemSubTotal;
  }



  checkExistingFoodItem(foodItemId: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if (this.orderedItems[i].FoodItemId === foodItemId) {
        return true;
      }
    }
  }

  increaseOnExistingFoodItem(foodItemId: number, quantity: number, subTotal: number, orderedItem: OrderedItem) {
    // for (let i = 0 ; i < orderedItems.length; i++ ) {

      if (orderedItem.FoodItemId === foodItemId) {

        orderedItem.FoodItemQuantity =
          Number.parseInt(orderedItem.FoodItemQuantity.toString(), 2)
          + Number.parseInt(quantity.toString(), 2);

        orderedItem.TotalPrice =
          Number.parseInt(orderedItem.TotalPrice.toString(), 2)
          + Number.parseInt(subTotal.toString(), 2);
      // }
    }
  }
}


