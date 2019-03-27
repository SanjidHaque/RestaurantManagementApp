import {Injectable} from '@angular/core';

import {Order} from '../models/order.model';
import {Inventory} from '../models/inventory.model';
import {FoodItem} from '../models/food-item.model';
import {Table} from '../models/table.model';
import {InventoryHistory} from '../models/inventory-history.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DataStorageService {

  backEndPort = '1548';
  rootUrl = 'http://localhost:' + this.backEndPort;

 // rootUrl = 'https://hodoo-backend.azurewebsites.net';
  
  constructor(private http: HttpClient) {
  }



  saveFoodItemImage(foodItemId: string, fileToUpload: File) {
    if (fileToUpload.name !==  null || fileToUpload.name !== '') {
      const formData = new FormData();
      formData.append('Image', fileToUpload);
      formData.append('FoodItemId', foodItemId);
      return this.http.post(this.rootUrl + '/api/SaveFoodItemImage', formData);
    }
  }


  getFoodItems() {
    return this.http.get<FoodItem[]>(this.rootUrl + '/api/GetFoodItems');
  }

  saveOrder(order: Order) {
    return this.http.post(this.rootUrl + '/api/StoreOrder', order);
  }


  deleteOrder(order: Order) {
    return this.http.post(this.rootUrl + '/api/DeleteOrder', order);
  }

  getOrders() {
    return this.http.get<Order[]>(this.rootUrl + '/api/GetOrders');
  }

  getInventories() {
    return this.http.get<Inventory[]>(this.rootUrl + '/api/GetInventories');
  }

  getTables() {
    return this.http.get<Table[]>(this.rootUrl + '/api/GetTables');
  }

  addNewTable(table: Table) {
    return this.http.post(this.rootUrl + '/api/AddNewTable', table);
  }

  editTable(table: Table) {
    return this.http.post(this.rootUrl + '/api/EditTable', table);
  }

  deleteTable(table: Table) {
    return this.http.post(this.rootUrl + '/api/DeleteTable', table);
  }

  addNewInventoryItem(inventory: Inventory) {
    return this.http.post(this.rootUrl + '/api/AddNewInventory', inventory);
  }

  editInventoryItem(inventory: Inventory) {
    return this.http.post(this.rootUrl + '/api/EditInventoryItem', inventory);
  }

  updateInventoryHistory(updateHistory: InventoryHistory) {
    return this.http.post(this.rootUrl + '/api/UpdateInventoryHistory', updateHistory);
  }


  deleteInventoryItem(inventory: Inventory) {
    return this.http.post(this.rootUrl + '/api/DeleteInventoryItem', inventory);
  }

  addFoodItem(foodItem: FoodItem) {
    return this.http.post(this.rootUrl + '/api/AddFoodItem', foodItem);
  }

  deleteFoodItem(foodItem: FoodItem) {
    return this.http.post(this.rootUrl + '/api/DeleteFoodItem', foodItem);
  }

  editFoodItem(foodItem: FoodItem) {
    return this.http.post(this.rootUrl + '/api/EditFoodItem', foodItem);
  }
}
