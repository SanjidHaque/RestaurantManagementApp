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

  getInventory(inventoryId: number) {
    return this.http.get(`${this.rootUrl + '/api/GetInventory'}/${inventoryId}`);
  }

  getAllInventory() {
    return this.http.get<Inventory[]>(this.rootUrl + '/api/GetAllInventory');
  }

  addNewInventory(inventory: Inventory) {
    return this.http.post<Inventory>(this.rootUrl + '/api/AddNewInventory', inventory);
  }

  editInventory(inventory: Inventory) {
    return this.http.put<Inventory>(this.rootUrl + '/api/EditInventory', inventory);
  }

  addInventoryQuantity(inventoryHistory: InventoryHistory) {
    return this.http.post<InventoryHistory>(
      this.rootUrl + '/api/AddInventoryQuantity', inventoryHistory);
  }

  removeInventoryQuantity(inventoryHistory: InventoryHistory) {
    return this.http.put<InventoryHistory>(
      this.rootUrl + '/api/RemoveInventoryQuantity', inventoryHistory);
  }

  deleteInventory(inventoryId: number)  {
    return this.http.delete(`${this.rootUrl + '/api/DeleteInventory'}/${inventoryId}`);
  }
}
