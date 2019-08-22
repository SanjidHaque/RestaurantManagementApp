import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Order} from '../../models/order.model';
import {OrderSession} from '../../models/order-session.model';
import {TableDataStorageService} from './table-data-storage.service';
import {OrderedItem} from '../../models/ordered-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderDataStorageService {

  private rootUrl = '';

  constructor(private http: HttpClient,
              private tableDataStorageService: TableDataStorageService) {
    this.rootUrl = tableDataStorageService.rootUrl;
  }

  getOrder(orderId: number) {
    return this.http.get(`${this.rootUrl + '/api/GetOrder'}/${orderId}`);
  }

  getAllOrder() {
    return this.http.get<Order[]>(this.rootUrl + '/api/GetAllOrder');
  }

  getAllCancelledOrderedItem() {
    return this.http.get<OrderedItem[]>(this.rootUrl + '/api/GetAllCancelledOrderedItem');
  }

  getCancelledOrderedItem(cancelledOrderedItemId: number) {
    return this.http.get(`${this.rootUrl + '/api/GetCancelledOrderedItem'}/${cancelledOrderedItemId}`);
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

  cancelAllOrderedItem(orderSession: OrderSession) {
    return this.http.put<OrderSession>(this.rootUrl + '/api/CancelAllOrderedItem', orderSession);
  }

  cancelSingleOrderedItem(orderedItem: OrderedItem) {
    return this.http.put<OrderSession>(this.rootUrl + '/api/CancelSingleOrderedItem', orderedItem);
  }

  deleteOrder(orderId: number) {
    return this.http.delete(`${this.rootUrl + '/api/DeleteOrder'}/${orderId}`);
  }

  deleteCancelledOrderedItem(orderedItemId: number) {
    return this.http.delete(`${this.rootUrl + '/api/DeleteCancelledOrderedItem'}/${orderedItemId}`);
  }

  revertInventory(orderedItems: OrderedItem[]) {
    return this.http.put<OrderedItem[]>(this.rootUrl + '/api/RevertInventory', orderedItems);
  }

  addToInventoryWastedList(orderedItems: OrderedItem[]) {
    return this.http.put<OrderedItem[]>(this.rootUrl + '/api/AddToInventoryWastedList', orderedItems);
  }

}
