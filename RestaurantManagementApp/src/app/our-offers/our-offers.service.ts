import { Response} from '@angular/http';
import {Http} from '@angular/http';
import { Injectable } from '@angular/core';
import { Uuid } from 'ng2-uuid';
import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import {OurOffers} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';
import {OrderedItems} from '../shared/ordered-items.model';
import {forEach} from '@angular/router/src/utils/collection';
import {Order} from '../shared/order.model';
import {Inventory} from '../shared/inventory.model';
import {FoodItems} from '../shared/food-item.model';
import {Ingredients} from '../shared/ingredients.model';
import {Table} from "../shared/table.model";


@Injectable()
export class OurOffersService {
  public uuidCodeOne = '';
  public TotalPrice = 0;
  public menuChanged = new Subject<OurOffers>();
  public orderedItemsChanged = new Subject<OrderedItems[]>();
  public ordersChanged = new Subject<Order>();
  public menu: OurOffers;
  public totalQuantity  = 0;
  public orderedItems: OrderedItems[] = [];
  public orders: Order;
  public acceptedOrder: Order;
  public rejectedOrder: Order;
  public setMenuSubTotal = 0;
  public foodItemSubTotal = 0;

  ingredients: Ingredients[] = [];
  ingredientsChanged = new Subject<Ingredients[]>();
  FoodItem: FoodItems[] = [];
  foodItemChanged = new Subject<FoodItems[]>();
  public inventory: Inventory[] = [];
  public inventoryChanged = new Subject<Inventory[]>();
  public table: Table[] = [];
  public tableChanged = new Subject<Table[]>();


  constructor(private uuid: Uuid,
            ) { this.uuidCodeOne = this.uuid.v1(); }



   clearOrders() {
    this.orderedItems = [];
   }
   updateInventoryList(inventoryId: string, editedInventoryItem: Inventory) {

    for ( let i = 0; i < this.inventory.length; i++) {
      if ( this.inventory[i].Id === inventoryId ) {
        this.inventory[i] = editedInventoryItem;
        this.inventoryChanged.next(this.inventory.slice());
      }
    }
   }

  addToInventoryList(inventory: Inventory) {
    this.inventory.unshift(inventory);
    this.inventoryChanged.next(this.inventory.slice());
  }

  addToTableList(table: Table) {
    this.table.unshift(table);
    this.tableChanged.next(this.table.slice());
  }

  getInventories() {
    return this.inventory.slice();
  }

  getTables() {
    return this.table.slice();
  }

  addToFoodItemList(foodItem: FoodItems) {
  //  this.FoodItem.push(foodItem); for any problem change unshift to push again
    this.FoodItem.unshift(foodItem);
    this.foodItemChanged.next(this.FoodItem.slice());
  }

  getIngredients() {
    return this.ingredients.slice();
  }

  addToIngredientList(ingredient: Ingredients) {
    this.ingredients.push(ingredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  removeFromSetMenuCart(setMenuId: number, quantity: number, subTotal: number) {

    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
        if ( this.orderedItems[i].SetMenuId === setMenuId) {
          this.orderedItems[i].SetMenuQuantity =
            this.orderedItems[i].SetMenuQuantity
            - quantity;

          this.orderedItems[i].SetMenuSubTotal =
            this.orderedItems[i].SetMenuSubTotal
            - subTotal;
          this.TotalPrice -= Number.parseInt(subTotal.toString());
          return this.orderedItems[i].SetMenuQuantity;
        }
     }
  }

  removeFromFoodItemCart(foodItemId: number, quantity: number, subTotal: number) {

    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if ( this.orderedItems[i].FoodItemId === foodItemId) {
        this.orderedItems[i].FoodItemQuantity =
          this.orderedItems[i].FoodItemQuantity
          - quantity;

        this.orderedItems[i].FoodItemSubTotal =
          this.orderedItems[i].FoodItemSubTotal
          - subTotal;
        this.TotalPrice -= Number.parseInt(subTotal.toString());
        this.totalQuantity -= Number.parseInt(quantity.toString());
        return this.orderedItems[i].FoodItemQuantity;
      }
    }
  }

  checkIfOrderedItemExist(foodItemId: number, orderId: string) {
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

  getAccepted(order: Order) {
    this.acceptedOrder = order;
  }
  getRejected(order: Order) {
    this.rejectedOrder = order;
  }
  getAcceptedOrder() {
    return this.acceptedOrder;
  }

  getRejectedOrder() {
    return this.rejectedOrder;
  }

  addToOrderedItemsList(orderedItems: OrderedItems) {
    this.orderedItems.push(orderedItems);
    this.orderedItemsChanged.next(this.orderedItems.slice());
  }

  addToOrderedList(order: Order) {
    this.orders = order;
    this.ordersChanged.next(order);
  }

  grandTotalPrice(price: number) {
     this.TotalPrice = Number.parseInt(price.toString()) + Number.parseInt(this.TotalPrice.toString());
     return this.TotalPrice;
  }

  SetMenuSubTotalPrice(price: number, quantity: number) {
    this.setMenuSubTotal = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
    return this.setMenuSubTotal;
  }

  FoodItemSubTotalPrice(price: number, quantity: number) {
    this.foodItemSubTotal = Number.parseInt(price.toString()) * Number.parseInt(quantity.toString());
    return this.foodItemSubTotal;
  }

   checkExistingSetMenu(setMenuId: number) {
     for (let i = 0 ; i < this.orderedItems.length; i++ ) {
       if (this.orderedItems[i].SetMenuId === setMenuId) {
         return true;
       }
     }
  }

  checkExistingFoodItem(foodItemId: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {
      if (this.orderedItems[i].FoodItemId === foodItemId) {
        return true;
      }
    }
  }

  increaseOnExistingSetMenu(setMenuId: number, quantity: number, subTotal: number) {
    for (let i = 0 ; i < this.orderedItems.length; i++ ) {

      if (this.orderedItems[i].SetMenuId === setMenuId) {

        this.orderedItems[i].SetMenuQuantity =
          Number.parseInt(this.orderedItems[i].SetMenuQuantity.toString())
          + Number.parseInt(quantity.toString());

        this.orderedItems[i].SetMenuSubTotal =
          Number.parseInt(this.orderedItems[i].SetMenuSubTotal.toString())
          + Number.parseInt(subTotal.toString());
      }
    }
  }

  increaseOnExistingFoodItem(foodItemId: number, quantity: number, subTotal: number ) {
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


