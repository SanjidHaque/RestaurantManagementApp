import { Injectable } from '@angular/core';

import {Subject} from 'rxjs';
import {OrderedItem} from '../../models/ordered-item.model';
import {Order} from '../../models/order.model';
import {Inventory} from '../../models/inventory.model';
import {FoodItem} from '../../models/food-item.model';
import {Table} from '../../models/table.model';
import {UUID} from 'angular2-uuid';


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


  constructor() {
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


