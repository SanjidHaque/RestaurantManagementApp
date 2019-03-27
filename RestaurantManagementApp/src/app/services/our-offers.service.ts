import { Injectable } from '@angular/core';

import {Subject} from 'rxjs';
import {OrderedItem} from '../models/ordered-item.model';
import {Order} from '../models/order.model';
import {Inventory} from '../models/inventory.model';
import {FoodItem} from '../models/food-item.model';
import {Ingredients} from '../models/ingredients.model';
import {Table} from '../models/table.model';
import {UUID} from 'angular2-uuid';


@Injectable()
export class OurOffersService {
  public uuidCodeOne = '';
  public totalPrice = 0;
  public totalQuantity  = 0;
  public orderedItems: OrderedItem[] = [];
  public orderedItemsChanged = new Subject<OrderedItem[]>();
  public order: Order;
  public orderChanged = new Subject<Order>();
  public orders: Order[] = [];
  public ordersChanged = new Subject<Order[]>();
  public foodItemSubTotal = 0;
  public ingredients: Ingredients[] = [];
  public foodItems: FoodItem[] = [];
  public foodItemsChanged = new Subject<FoodItem[]>();
  public inventories: Inventory[] = [];
  public inventoriesChanged = new Subject<Inventory[]>();
  public tables: Table[] = [];
  public tablesChanged = new Subject<Table[]>();


  constructor() {
    this.uuidCodeOne = UUID.UUID();
  }


   clearOrders() {
    this.orderedItems = [];
   }

   updateInventoryList(inventoryId: number, editedInventoryItem: Inventory) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId ) {
        this.inventories[i].Name = editedInventoryItem.Name;
        this.inventories[i].Unit = editedInventoryItem.Unit;
        this.inventoriesChanged.next(this.inventories.slice());
      }
    }
   }

  addToInventoryList(inventory: Inventory) {
    this.inventories.push(inventory);
    this.inventoriesChanged.next(this.inventories.slice());
  }

  addNewTable(table: Table) {
    this.tables.push(table);
    this.tablesChanged.next(this.tables.slice());
  }

  editTable(editedTable: Table) {
    for (let i = 0; i < this.tables.length; i++) {
      if ( this.tables[i].Id === editedTable.Id ) {
        this.tables[i].Name = editedTable.Name;
        this.tablesChanged.next(this.tables.slice());
        return true;
      }
    }
    return false;
  }





  addToFoodItemList(foodItem: FoodItem) {
    this.foodItems.push(foodItem);
    this.foodItemsChanged.next(this.foodItems.slice());
  }

  updateFoodItemList(editedFoodItem: FoodItem) {
    for (let i = 0; i< this.foodItems.length; i++ ) {
      if ( this.foodItems[i].Id === editedFoodItem.Id ) {
        this.foodItems[i] = editedFoodItem;
        this.foodItemsChanged.next(this.foodItems.slice());
      }
    }
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

  checkIfOrderedItemExist(foodItemId: number, orderId: number) {
    for (let i = 0; i < this.orderedItems.length; i++) {
      if (this.orderedItems[i].FoodItemId === foodItemId
        && this.orderedItems[i].OrderId === orderId) {
        return this.orderedItems[i].Id;
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



  FoodItemSubTotalPrice(price: number, quantity: number) {
    this.foodItemSubTotal = price * quantity;
    return this.foodItemSubTotal;
  }



  checkExistingFoodItem(foodItemId: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if (this.orderedItems[i].FoodItemId === foodItemId) {
        return true;
      }
    }
  }

  increaseOnExistingFoodItem(foodItemId: number, quantity: number, subTotal: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {

      if (this.orderedItems[i].FoodItemId === foodItemId) {

        this.orderedItems[i].FoodItemQuantity =
          Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString(), 2)
          + Number.parseInt(quantity.toString(), 2);

        this.orderedItems[i].TotalPrice =
          Number.parseInt(this.orderedItems[i].TotalPrice.toString(), 2)
          + Number.parseInt(subTotal.toString(), 2);
      }
    }
  }
}


