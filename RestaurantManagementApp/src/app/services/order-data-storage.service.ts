import { Injectable } from '@angular/core';
import {Order} from '../models/order.model';
import {HttpClient} from '@angular/common/http';
import {TableDataStorageService} from './table-data-storage.service';

@Injectable({
  providedIn: 'root'
})
export class OrderDataStorageService {

  private rootUrl = '';

  constructor(private http: HttpClient,
              private tableDataStorageService: TableDataStorageService) {
    this.rootUrl = tableDataStorageService.rootUrl;
  }

  getAllOrder() {
    return this.http.get<Order[]>(this.rootUrl + '/api/GetAllOrder');
  }

  addNewOrder(order: Order) {
    return this.http.post<Order>(this.rootUrl + '/api/AddNewOrder', order);
  }

  deleteOrder(orderId: number) {
    return this.http.delete(`${this.rootUrl + '/api/DeleteOrder'}/${orderId}`);
  }
}
