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
import {Popup} from 'ng2-opd-popup';

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
  inventoryCost = 0;
  orderProfit = 0;

  public tables: Table[] = [];
  subscription: Subscription;
  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private route: ActivatedRoute,
              private uuid: Uuid,
              private popup: Popup) {
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
  discardOrder() {
    this.popup.options = {
      header: 'Destroy Current Order?',
      color: '#760000', // red, blue....
      widthProsentage: 40, // The with of the popou measured by browser width
      animationDuration: 1, // in seconds, 0 = no animation
      showButtons: true, // You can hide this in case you want to use custom buttons
      confirmBtnContent: 'Confirm', // The text on your confirm button
      cancleBtnContent: 'Cancel', // the text on your cancel button
      confirmBtnClass: 'btn btn-default', // your class for styling the confirm button
      cancleBtnClass: 'btn btn-default', // you class for styling the cancel button
      animation: 'bounceIn' // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    };
    this.popup.show();
  }

  confirmEvent() {
    this._ourOfferService.clearOrders();
    this._ourOfferService.TotalPrice = 0;
    this._ourOfferService.totalQuantity = 0;
    this.router.navigate(['our-offers/regulars']);
    this.popup.hide();
  }

  cancelEvent() {
    this.popup.hide();
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

  destroyOrder() {

  }


  validate() {
    const orderId = this.uuid.v1();
    this.onCheck  = 1;

    this.orderedItems = this._ourOfferService.orderedItems;
    for ( let i = 0; i < this._ourOfferService.orderedItems.length; i++) {
      this._ourOfferService.orderedItems[i].OrderId = orderId;

    }
   /* const index = this._ourOfferService.orderedItems.findIndex(d => d.FoodItemQuantity === 0 );
   this._ourOfferService.orderedItems.splice(index, 1);*/

    const totalPrice = this._ourOfferService.TotalPrice;
    const orderStatus = 0;
    if ( this.selectedTable === '' || this.selectedTable === 'Select a Table' ) {
      this.table  =  'No Table';
    } else {
      this.table = this.selectedTable;
    }
    /*for (let i = 0; i < this.orderedItems.length; i++) {
        this.inventoryCost = Number.parseInt(this.inventoryCost.toString()) +
          (Number.parseInt(this.orderedItems[i].FoodItemQuantity) *
    }*/
    this.change = Number.parseInt(this.tendered.toString())
      - Number.parseInt(totalPrice.toString());
    const dateTime = new Date().toLocaleString();
    console.log(dateTime);
    this.orders = new Order(orderId, this._ourOfferService.orderedItems, totalPrice,
      this.tendered, this.change, orderStatus, dateTime , this.table, null, null );
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
