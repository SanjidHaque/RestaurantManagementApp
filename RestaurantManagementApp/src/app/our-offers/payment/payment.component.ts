import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DataStorageService} from '../../services/data-storage.service';
import {OurOffersService} from '../../services/our-offers.service';
import {Order} from '../../models/order.model';
import {OrderedItem} from '../../models/ordered-item.model';
import {Table} from '../../models/table.model';
import {Subscription} from 'rxjs';
import {Inventory} from '../../models/inventory.model';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  grandTotal : number;
  public orderedItems: OrderedItem[];
  public orders: Order;
  onCheck = 0;
  tendered: number;
  change = 0;
  selectedTable = '';
  table: string;
  inventoryCost = 0;
  orderProfit = 0;
  public inventories: Inventory[] = [] ;
  public tables: Table[] = [];
  subscription: Subscription;

  constructor(private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private router: Router,
              private _route: ActivatedRoute) {
    this.tendered = 0;
  }

  ngOnInit() {
    this.grandTotal = this._ourOfferService.totalPrice;
    this._route.data.
    subscribe(
      ( data: Table[]) => {
        this._ourOfferService.tables = data['tables'];
      }
    );
    this.tables = this._ourOfferService.tables;
    this.subscription = this._ourOfferService.tablesChanged
      .subscribe(
        (tables: Table[]) => {
          this.tables = tables;
        }
      );
  }


  discardOrder() {
  const dialog = confirm('Delete this order?\n' +
    'You will lose any kind of data associated with the current order!');
    if (dialog === true) {
      this.confirmEvent();
      }
  }

  confirmEvent() {
    this._ourOfferService.clearOrders();
    this._ourOfferService.totalPrice = 0;
    this._ourOfferService.totalQuantity = 0;
    this.router.navigate(['our-offers/regulars']);
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
    const orderId = null;
    this.onCheck  = 1;

    this.orderedItems = this._ourOfferService.orderedItems;
    for ( let i = 0; i < this._ourOfferService.orderedItems.length; i++) {
      this._ourOfferService.orderedItems[i].OrderId = orderId;

    }

    const totalPrice = this._ourOfferService.totalPrice;
    if ( this.selectedTable === '' || this.selectedTable === 'Select a Table' ) {
      this.table  =  'No Table';
    } else {
      this.table = this.selectedTable;
    }
    for (let i = 0; i < this.orderedItems.length; i++) {
        this.inventoryCost = Number.parseInt(this.inventoryCost.toString()) +
          (Number.parseInt(this.orderedItems[i].FoodItemQuantity.toString()) *
            Number.parseInt(this.orderedItems[i].TotalPrice.toString()));
    }

    this.orderProfit = totalPrice - this.inventoryCost;
    this.change = Number.parseInt(this.tendered.toString())
      - Number.parseInt(totalPrice.toString());
    const dateTime = new Date().toLocaleString();

    this.orders = new Order(orderId, this._ourOfferService.orderedItems, totalPrice,
      this.tendered, this.change, dateTime , this.table,
      this.inventoryCost, this.orderProfit );
    this._ourOfferService.addToOrderedList(this.orders);

    this._dataStorageService.saveOrder(this.orders).subscribe();
    this.router.navigate(['receipt']);
  }

}
