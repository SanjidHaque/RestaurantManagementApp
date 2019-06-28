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

  updateInventoryHistory(updateHistory: InventoryHistory) {
    return this.http.post<Inventory>(
      this.rootUrl + '/api/UpdateInventoryHistory', updateHistory);
  }

  removeInventoryQuantity(inventory: Inventory) {
    return this.http.put<Inventory>(
      this.rootUrl + '/api/RemoveInventoryQuantity', inventory);
  }

  deleteInventory(inventoryId: number)  {
    return this.http.delete(`${this.rootUrl + '/api/DeleteInventory'}/${inventoryId}`);
  }
}
