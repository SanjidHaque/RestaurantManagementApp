
import {Injectable} from '@angular/core';


import {Order} from '../models/order.model';
import {Inventory} from '../models/inventory.model';
import {FoodItems} from '../models/food-item.model';
import {Table} from '../models/table.model';
import {InventoryHistoryModel} from '../models/inventory-history.model';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DataStorageService {

  private backEndPort = '1548';

  public order: Order;
  private _foodItemApi = 'http://localhost:' + this.backEndPort + '/api/GetFoodItems';
  private _inventoryApi = 'http://localhost:' + this.backEndPort + '/api/GetInventories';
  private _tableApi = 'http://localhost:' + this.backEndPort + '/api/GetTables';
  private _orderApi  = 'http://localhost:' + this.backEndPort + '/api/GetOrders';

  constructor(private _http: HttpClient) {
  }


  saveFoodItemImage(foodItemId: string, fileToUpload: File ) {
    if (fileToUpload.name !==  null || fileToUpload.name !== '') {
      const endpoint = 'http://localhost:' + this.backEndPort + '/api/SaveFoodItemImage';
      const formData: FormData = new FormData();
      formData.append('Image', fileToUpload, fileToUpload.name);
      formData.append('FoodItemId', foodItemId);
      return this._http
        .post(endpoint, formData);
    }
  }



  getFoodItems() {
    return this._http.get(this._foodItemApi);
  }

  saveOrder(order: Order) {
    return this._http.post(
      'http://localhost:' + this.backEndPort + '/api/StoreOrder', order);
  }


  deleteOrder(order: Order) {
    return this._http.post(
      'http://localhost:' + this.backEndPort + '/api/DeleteOrder', order);
  }

  getOrders() {
    return this._http.get(this._orderApi);
  }

  getInventories() {
    return this._http.get(this._inventoryApi);
  }

  getTables() {
    return this._http.get(this._tableApi);
  }

  addNewTable(table: Table) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/AddNewTable', table);
  }

  editTable(table: Table) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/EditTable', table);
  }

  deleteTable(table: Table) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/DeleteTable', table);
  }

  addNewInventoryItem(inventory: Inventory) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/AddNewInventory', inventory);
  }

  editInventoryItem(inventory: Inventory) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/EditInventoryItem', inventory);
  }

  updateInventoryHistory(updateHistory: InventoryHistoryModel) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/UpdateInventoryHistory', updateHistory);
  }


  deleteInventoryItem(inventory: Inventory) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/DeleteInventoryItem', inventory);
  }

  addFoodItem(foodItem: FoodItems) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/AddFoodItem', foodItem);
  }

  deleteFoodItem(foodItem: FoodItems) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/DeleteFoodItem', foodItem);
  }

  editFoodItem(foodItem: FoodItems) {
    return this._http.post('http://localhost:' + this.backEndPort + '/api/EditFoodItem', foodItem);
  }
}
