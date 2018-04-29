import {Injectable, OnInit} from '@angular/core';
import { Http, Response } from '@angular/http';
import {OurOffersService} from '../our-offers/our-offers.service';
import {OurOffers} from '../our-offers/our-offers.model';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Order} from './order.model';
import {Inventory} from './inventory.model';
import {Subject} from 'rxjs/Subject';
import {FoodItems} from './food-item.model';
import {SummaryOfInventory} from './summary-of-inventory';
import {CashFlow} from './cash-flow';
import {Table} from './table.model';
@Injectable()
export class DataStorageService {

  public order: Order;
   private _url = 'assets/menu-from-api.json';
  // private _url = 'http://localhost:1548/api/menu';

  private _inventoryJson = 'assets/inventories.json';
  private _inventoryApi = 'http://localhost:1548/api/GetInventories';
  private _tableJson = 'assets/tables.json';
  private _tableApi = 'http://localhost:1548/api/GetTables';
  private _cashFlowJson = 'assets/cash-flow.json';
  private _sumOfInventoryJson = 'assets/sum-of-inventory.json';

  private _orderJson  = 'assets/order.json';

  constructor(private _http: Http,
              private _ourOffersService: OurOffersService) {
  }


  postFile(foodItemId: string, fileToUpload: File ) {
    const endpoint = 'http://localhost:1548/api/UploadImage';
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, fileToUpload.name);
    formData.append('FoodItemId', foodItemId);
    return this._http
      .post(endpoint, formData );
  }

  getSummaryOfInventories() {
    return this._http.get(this._sumOfInventoryJson)
      .map(
        (response: Response) => {
          const sumOfInv: SummaryOfInventory[] = response.json();
          return sumOfInv;
        }
      );
  }

  getCashFlow() {
    return this._http.get(this._cashFlowJson)
      .map(
        (response: Response) => {
          const cashFlow: CashFlow[] = response.json();
          return cashFlow;
        }
      );
  }

  getMenu() {
    return this._http.get(this._url)
      .map(
        (response: Response) => {
           const menus: OurOffers = response.json();
           console.log(menus);
           return menus;
         }
      )
  }

  storeOrders() {
    return this._http.post('http://localhost:1548/api/PostMenu',
     this._ourOffersService.orders);
  }

  acceptOrders() {
    return this._http.post('http://localhost:1548/api/AcceptOrders',
      this._ourOffersService.getAcceptedOrder() ).map(
        res => res.json())
      .catch((error: any) => Observable.throw(error.json().error ||
      'Server error'))
      .subscribe();
  }

  rejectOrders() {
    return this._http.post('http://localhost:1548/api/RejectOrders',
      this._ourOffersService.getRejectedOrder () ).map(
      res => res.json())
      .catch((error: any) => Observable.throw(error.json().error ||
        'Server error'))
      .subscribe();
  }


  getOrders() {
    return this._http.get(this._orderJson)
      .map(
        (response: Response) => {
          const orders: Order[] = response.json();
          return orders;
        }
      );
  }

  getInventories() {
    return this._http.get(this._inventoryJson)
      .map(
        (response: Response) => {
          const inventories: Inventory[] = response.json();
          console.log(inventories);
          return inventories;
        }
      );
  }

  getTables() {
    return this._http.get(this._tableJson)
      .map(
        (response: Response) => {
          const tables: Table[] = response.json();
          console.log(tables);
          return tables;
        }
      );
  }

  addNewTable(table: Table) {
    return this._http.post('http://localhost:1548/api/AddNewTable',
      table)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

  deleteTable(table: Table) {
    return this._http.post('http://localhost:1548/api/DeleteTable',
      table)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  addNewInventoryItem(inventory: Inventory) {
    return this._http.post('http://localhost:1548/api/AddNewInventory',
      inventory)
      .subscribe(
      (response: Response) => {
        console.log(response);
      }
    );
  }

  editInventoryItem(inventory: Inventory) {
    return this._http.post('http://localhost:1548/api/EditInventoryItem',
      inventory)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }


  deleteInventoryItem(inventory: Inventory) {
    return this._http.post('http://localhost:1548/api/DeleteInventoryItem',
      inventory)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  addFoodItem(foodItem: FoodItems) {
    return this._http.post('http://localhost:1548/api/AddFoodItem',
      foodItem)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }
  deleteFoodItem(foodItem: FoodItems) {
    return this._http.post('http://localhost:1548/api/DeleteFoodItem',
      foodItem)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }

  editFoodItem(foodItem: FoodItems) {
    return this._http.post('http://localhost:1548/api/DeleteInventoryItem',
      foodItem)
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
  }



}
