import {Injectable} from '@angular/core';

import {Order} from '../models/order.model';
import {Inventory} from '../models/inventory.model';
import {FoodItem} from '../models/food-item.model';
import {Table} from '../models/table.model';
import {InventoryHistory} from '../models/inventory-history.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class DataStorageService {

  backEndPort = '1548';
  rootUrl = 'http://localhost:' + this.backEndPort;

 // rootUrl = 'https://hodoo-backend.azurewebsites.net';
  
  constructor(private http: HttpClient) {
  }



  uploadFoodItemImage(foodItemId: string, fileToUpload: File) {
    if (fileToUpload.name !==  null || fileToUpload.name !== '') {
      const formData = new FormData();
      formData.append('Image', fileToUpload);
      formData.append('FoodItemId', foodItemId);
      return this.http.post(this.rootUrl + '/api/SaveFoodItemImage', formData);
    }
  }


  getAllFoodItem() {
    return this.http.get<FoodItem[]>(this.rootUrl + '/api/GetFoodItems');
  }


  addNewOrder(order: Order) {
    return this.http.post(this.rootUrl + '/api/StoreOrder', order);
  }


  deleteOrder(order: Order) {
    return this.http.post(this.rootUrl + '/api/DeleteOrder', order);
  }

  getAllOrder() {
    return this.http.get<Order[]>(this.rootUrl + '/api/GetOrders');
  }



  getAllTable() {
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
