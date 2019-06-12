import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Inventory} from '../../models/inventory.model';
import {TableDataStorageService} from './table-data-storage.service';
import {InventoryHistory} from '../../models/inventory-history.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryDataStorageService {
  private rootUrl = '';

  constructor(private http: HttpClient,
              private tableDataStorageService: TableDataStorageService) {
    this.rootUrl = tableDataStorageService.rootUrl;
  }

  getAllInventoryItem() {
    return this.http.get<Inventory[]>(
      this.rootUrl + '/api/GetAllInventoryItem');
  }

  addNewInventoryItem(inventory: Inventory) {
    return this.http.post<Inventory>(
      this.rootUrl + '/api/AddNewInventoryItem', inventory);
  }

  editInventoryItem(inventory: Inventory) {
    return this.http.put<Inventory>(
      this.rootUrl + '/api/EditInventoryItem', inventory);
  }

  updateInventoryHistory(updateHistory: InventoryHistory) {
    return this.http.post<Inventory>(
      this.rootUrl + '/api/UpdateInventoryHistory', updateHistory);
  }

  removeInventoryQuantity(inventory: Inventory) {
    return this.http.put<Inventory>(
      this.rootUrl + '/api/RemoveInventoryQuantity', inventory);
  }

  deleteInventoryItem(inventoryId: number)  {
    return this.http.delete(
      `${this.rootUrl + '/api/DeleteInventoryItem'}/${inventoryId}`);
  }
}
