import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../shared/data-storage.service';
import {OurOffersService} from '../our-offers.service';
import {Order} from '../../shared/order.model';
import { Response } from '@angular/http';
import {OrderedItems} from '../../shared/ordered-items.model';
import { Uuid } from 'ng2-uuid';
import {Table} from '../../shared/table.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit, DoCheck {

  grandTotal : number;
  public orderedItems: OrderedItems[];
  public orders: Order;
  onCheck = 0;
  tendered: number;
  change = 0;
  selectedTable = '';
  table: string;


  public tables: Table[] = [];
  subscription: Subscription;
  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid) {
    this.tendered = 0;
  }

  ngOnInit() {
    this.grandTotal = this._ourOfferService.TotalPrice;
    this._dataStorageService.getTables()
      .subscribe(
        (tables: Table[]) => {
          this._ourOfferService.table = tables;
        }
      );
    this.tables = this._ourOfferService.table;
    this.subscription = this._ourOfferService.tableChanged
      .subscribe(
        (tables: Table[]) => {
          this.tables = tables;
        }
      );
  }

  ngDoCheck() {

  }

  back() {
      this.router.navigate(['our-offers']);
  }

  checkCertainAmount() {
    if (this.tendered < this.grandTotal || this.grandTotal === 0 ) {
      return false;
    } else {
      return true;
    }
  }
  selectChangeHandler (event: any) {
    this.selectedTable = event.target.value;
  }
  checkCertainChange() {
    if (this.tendered < this.grandTotal || this.tendered === 0 ) {
      return false;
    } else {
      return true;
    }
  }



  validate() {
    const orderId = this._ourOfferService.uuidCodeOne;
    this.onCheck  = 1;
    this.orderedItems = this._ourOfferService.orderedItems;
    const totalPrice = this._ourOfferService.TotalPrice;
    const orderStatus = 0;
    if ( this.selectedTable === '' || this.selectedTable === 'No Table' ) {
      this.table  =  'No Table';
    } else {
      this.table = this.selectedTable;
    }

    this.change = Number.parseInt(this.tendered.toString())
      - Number.parseInt(totalPrice.toString());
    const dateTime = new Date().toLocaleString();
    console.log(dateTime);
    this.orders = new Order(orderId, this.orderedItems, totalPrice,
      this.tendered, this.change, orderStatus, dateTime , this.table );
    this._ourOfferService.addToOrderedList(this.orders);
    this._dataStorageService.storeOrders()
      .subscribe(
        (response: Response) => {
          console.log(response);
        }
      );
    this.router.navigate(['receipt']);
  }

}
