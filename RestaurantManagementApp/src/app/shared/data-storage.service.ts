import {Injectable, OnInit} from '@angular/core';
import { Http, Response } from '@angular/http';
import {OurOffersService} from '../our-offers/our-offers.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Order} from './order.model';
import {Inventory} from './inventory.model';
import {FoodItems} from './food-item.model';
import {Table} from './table.model';
import {InventoryHistoryModel} from './inventory-history.model';
@Injectable()
export class DataStorageService {

  public order: Order;
  private _foodItemJson = 'assets/food-item.json';
  private _foodItemApi = 'http://localhost:1548/api/GetFoodItems';

  private _inventoryJson = 'assets/inventories.json';
  private _inventoryApi = 'http://localhost:1548/api/GetInventories';
  private _tableJson = 'assets/tables.json';
  private _tableApi = 'http://localhost:1548/api/GetTables';

  private _orderJson  = 'assets/order.json';
  private _orderApi  = 'http://localhost:1548/api/GetOrders';

  constructor(private _http: Http,
              private _ourOffersService: OurOffersService) {
  }


  saveFoodItemImage(foodItemId: string, fileToUpload: File ) {
    if (fileToUpload.name !==  null || fileToUpload.name !== '') {
      const endpoint = 'http://localhost:1548/api/SaveFoodItemImage';
      const formData: FormData = new FormData();
      formData.append('Image', fileToUpload, fileToUpload.name);
      formData.append('FoodItemId', foodItemId);
      return this._http
        .post(endpoint, formData );
    }
  }



  getFoodItems() {
    return this._http.get(this._foodItemJson)
      .map(
        (response: Response) => {
           const foodItems: FoodItems[] = response.json();
           console.log(foodItems);
           return foodItems;
         }
      )
  }

  saveOrder(order: Order) {
    return this._http.post('http://localhost:1548/api/StoreOrder',
     order).subscribe(
      (response: Response) => {
        console.log(response);
      }
    );
  }


  deleteOrder(order: Order) {
    return this._http.post('http://localhost:1548/api/DeleteOrder', order);
  }

  getOrders() {
    return this._http.get(this._orderApi)
      .map(
        (response: Response) => {
          const orders: Order[] = response.json();
          return orders;
        }
      );
  }

  getInventories() {
    return this._http.get(this._inventoryJson)
      .map(
        (response: Response) => {
          const inventories: Inventory[] = response.json();
          console.log(inventories);
          return inventories;
        }
      );
  }

  getTables() {
    return this._http.get(this._tableJson)
      .map(
        (response: Response) => {
          const tables: Table[] = response.json();
          console.log(tables);
          return tables;
        }
      );
  }

  addNewTable(table: Table) {
    return this._http.post('http://localhost:1548/api/AddNewTable',
      table)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  editTable(table: Table) {
    return this._http.post('http://localhost:1548/api/EditTable',
      table)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  deleteTable(table: Table) {
    return this._http.post('http://localhost:1548/api/DeleteTable',
      table)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  addNewInventoryItem(inventory: Inventory) {
    return this._http.post('http://localhost:1548/api/AddNewInventory',
      inventory)
      .subscribe(
      (response: Response) => {
        console.log(response);
      }
    );
  }

  editInventoryItem(inventory: Inventory) {
    return this._http.post('http://localhost:1548/api/EditInventoryItem',
      inventory)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

  updateInventoryHistory(updateHistory: InventoryHistoryModel) {
    return this._http.post('http://localhost:1548/api/UpdateInventoryHistory',
      updateHistory);
  }


  deleteInventoryItem(inventory: Inventory) {
    return this._http.post('http://localhost:1548/api/DeleteInventoryItem', inventory);
  }
  addFoodItem(foodItem: FoodItems) {
    return this._http.post('http://localhost:1548/api/AddFoodItem',
      foodItem)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  deleteFoodItem(foodItem: FoodItems) {
    return this._http.post('http://localhost:1548/api/DeleteFoodItem',
      foodItem);
  }

  editFoodItem(foodItem: FoodItems) {
    return this._http.post('http://localhost:1548/api/EditFoodItem', foodItem);
  }



}
