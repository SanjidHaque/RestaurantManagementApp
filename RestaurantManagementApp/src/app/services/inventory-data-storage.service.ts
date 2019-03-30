import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DataStorageService} from './data-storage.service';
import {Inventory} from '../models/inventory.model';
import {Observable} from 'rxjs';
import {InventoryHistory} from '../models/inventory-history.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryDataStorageService {

  private rootUrl = '';

  constructor(private http: HttpClient,
              private dataStorageService: DataStorageService) {
    this.rootUrl = dataStorageService.rootUrl;
  }

  getAllInventoryItem() {
    return this.http.get<Inventory[]>(this.rootUrl + '/api/GetAllInventoryItem');
  }

  addNewInventoryItem(inventory: Inventory): Observable<Inventory>  {
    return this.http.post<Inventory>(this.rootUrl + '/api/AddNewInventoryItem', inventory);
  }

  editInventoryItem(inventory: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(this.rootUrl + '/api/EditInventoryItem', inventory);
  }

  updateInventoryHistory(updateHistory: InventoryHistory) {
    return this.http.post(this.rootUrl + '/api/UpdateInventoryHistory', updateHistory);
  }

  deleteInventoryItem(inventoryId: number): Observable<{}>  {
    const rootUrl = this.rootUrl + '/api/DeleteInventoryItem/';
    return this.http.delete(`${rootUrl}/${inventoryId}`);
  }
}
