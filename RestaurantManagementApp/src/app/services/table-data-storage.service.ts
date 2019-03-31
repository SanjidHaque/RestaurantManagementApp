import {Injectable} from '@angular/core';

import {Order} from '../models/order.model';
import {Inventory} from '../models/inventory.model';
import {FoodItem} from '../models/food-item.model';
import {Table} from '../models/table.model';
import {InventoryHistory} from '../models/inventory-history.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class TableDataStorageService {

  backEndPort = '1548';
  rootUrl = 'http://localhost:' + this.backEndPort;

 // rootUrl = 'https://hodoo-backend.azurewebsites.net';
  
  constructor(private http: HttpClient) {
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







}
