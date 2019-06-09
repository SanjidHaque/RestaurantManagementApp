import { Injectable } from '@angular/core';
import {Order} from '../../models/order.model';
import {HttpClient} from '@angular/common/http';
import {TableDataStorageService} from './table-data-storage.service';
import {OrderSession} from '../../models/order-session.model';

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

  placeOrder(order: Order) {
    return this.http.put<Order>(this.rootUrl + '/api/PlaceOrder', order);
  }

  serveOrder(orderSession: OrderSession) {
    return this.http.put<OrderSession>(this.rootUrl + '/api/ServeOrder', orderSession);
  }

  validateOrder(order: Order) {
    return this.http.post<Order>(this.rootUrl + '/api/ValidateOrder', order);
  }

  cancelOrder(orderSession: OrderSession) {
    return this.http.put<OrderSession>(this.rootUrl + '/api/CancelOrder', orderSession);
  }

  deleteOrder(orderId: number) {
    return this.http.delete(`${this.rootUrl + '/api/DeleteOrder'}/${orderId}`);
  }

  revertInventory(orderSession: OrderSession) {
    return this.http.put<OrderSession>(this.rootUrl + '/api/RevertInventory', orderSession);
  }
}
