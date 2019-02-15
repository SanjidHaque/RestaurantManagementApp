import { Injectable } from '@angular/core';

import {Subject} from 'rxjs';
import {OrderedItems} from '../models/ordered-items.model';
import {Order} from '../models/order.model';
import {Inventory} from '../models/inventory.model';
import {FoodItems} from '../models/food-item.model';
import {Ingredients} from '../models/ingredients.model';
import {Table} from '../models/table.model';
import {UUID} from 'angular2-uuid';


@Injectable()
export class OurOffersService {
  public uuidCodeOne = '';
  public TotalPrice = 0;
  public orderedItemsChanged = new Subject<OrderedItems[]>();
  public totalQuantity  = 0;
  public orderedItems: OrderedItems[] = [];
  public orders: Order;
  public ordersChanged = new Subject<Order>();
  public ordersList: Order[] = [];
  public ordersListChanged = new Subject<Order[]>();
  public foodItemSubTotal = 0;
  public ingredients: Ingredients[] = [];
  public FoodItem: FoodItems[] = [];
  public foodItemChanged = new Subject<FoodItems[]>();
  public inventory: Inventory[] = [];
  public inventoryChanged = new Subject<Inventory[]>();
  public table: Table[] = [];
  public tableChanged = new Subject<Table[]>();


  constructor() {
    this.uuidCodeOne = UUID.UUID();
  }


   clearOrders() {
    this.orderedItems = [];
   }

   updateInventoryList(inventoryId: string, editedInventoryItem: Inventory) {
    for ( let i = 0; i < this.inventory.length; i++) {
      if ( this.inventory[i].Id === inventoryId ) {
        this.inventory[i].Name = editedInventoryItem.Name;
        this.inventory[i].Unit = editedInventoryItem.Unit;
        this.inventoryChanged.next(this.inventory.slice());
      }
    }
   }

  addToInventoryList(inventory: Inventory) {
    this.inventory.push(inventory);
    this.inventoryChanged.next(this.inventory.slice());
  }

  addToTableList(table: Table) {
    this.table.push(table);
    this.tableChanged.next(this.table.slice());
  }
  editTable(editedTable: Table) {
    for ( let i = 0; i < this.table.length; i++) {
      if ( this.table[i].Id === editedTable.Id ) {
        this.table[i].Name = editedTable.Name;
        this.tableChanged.next(this.table.slice());
        return true;
      }
    }
    return false;
  }





  addToFoodItemList(foodItem: FoodItems) {
    this.FoodItem.push(foodItem);
    this.foodItemChanged.next(this.FoodItem.slice());
  }

  updateFoodItemList(editedFoodItem: FoodItems) {
    for ( let i = 0; i< this.FoodItem.length; i++ ) {
      if ( this.FoodItem[i].Id === editedFoodItem.Id ) {
        this.FoodItem[i] = editedFoodItem;
        this.foodItemChanged.next(this.FoodItem.slice());
      }
    }
  }





  removeFromFoodItemCart(foodItemId: string, quantity: number, subTotal: number) {

    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if ( this.orderedItems[i].FoodItemId === foodItemId) {
        if (this.orderedItems[i].FoodItemQuantity >= quantity) {
          this.orderedItems[i].FoodItemQuantity =
            this.orderedItems[i].FoodItemQuantity
            - quantity;

          this.orderedItems[i].FoodItemSubTotal =
            this.orderedItems[i].FoodItemSubTotal
            - subTotal;
          this.TotalPrice -= Number.parseInt(subTotal.toString());
          this.totalQuantity -= Number.parseInt(quantity.toString());
          if (this.orderedItems[i].FoodItemQuantity === 0) {
            this.orderedItems.splice(i, 1);
          }
        }

      }
    }
  }

  checkIfOrderedItemExist(foodItemId: string, orderId: string) {
    for (let i = 0; i < this.orderedItems.length; i++) {
      if (this.orderedItems[i].FoodItemId === foodItemId
        && this.orderedItems[i].OrderId === orderId) {
        return this.orderedItems[i].OrderItemId;
      }
    }
    return null;
  }


  getOrderedItemsList() {
    return this.orderedItems.slice();
  }

  deleteOrder(order: Order) {
    for (let i = 0; i < this.ordersList.length; i++ ) {
      if ( this.ordersList[i].Id === order.Id  ) {
        this.ordersList.splice(i, 1);
      }
    }
  }
  addToOrderedItemsList(orderedItems: OrderedItems) {
    this.orderedItems.push(orderedItems);
    this.orderedItemsChanged.next(this.orderedItems.slice());
  }

  addToOrderedList(order: Order) {
    this.orders = order;
    this.ordersChanged.next(order);
    this.ordersList.push(order);
    this.ordersListChanged.next(this.ordersList.slice());
  }

  grandTotalPrice(price: number) {
     this.TotalPrice = Number.parseInt(price.toString()) + Number.parseInt(this.TotalPrice.toString());
     return this.TotalPrice;
  }



  FoodItemSubTotalPrice(price: number, quantity: number) {
    this.foodItemSubTotal = price * quantity;
    return this.foodItemSubTotal;
  }



  checkExistingFoodItem(foodItemId: string) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if (this.orderedItems[i].FoodItemId === foodItemId) {
        return true;
      }
    }
  }

  increaseOnExistingFoodItem(foodItemId: string, quantity: number, subTotal: number ) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {

      if (this.orderedItems[i].FoodItemId === foodItemId) {

        this.orderedItems[i].FoodItemQuantity =
          Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString())
          + Number.parseInt(quantity.toString());

        this.orderedItems[i].FoodItemSubTotal =
          Number.parseInt(this.orderedItems[i].FoodItemSubTotal.toString())
          + Number.parseInt(subTotal.toString());
      }
    }
  }
}


