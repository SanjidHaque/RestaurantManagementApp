import { Injectable } from '@angular/core';
import {Order} from '../models/order.model';
import {FoodItem} from '../models/food-item.model';
import {Inventory} from '../models/inventory.model';
import {Table} from '../models/table.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  inventories: Inventory[] = [];
  foodItems: FoodItem[] = [];
  orders: Order[] = [];
  tables: Table[] = [];

  getAllInventoryItem() {
    return this.inventories.slice();
  }

}
