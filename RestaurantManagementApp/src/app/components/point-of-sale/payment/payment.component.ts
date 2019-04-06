import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OrderedItem} from '../../../models/ordered-item.model';
import {Order} from '../../../models/order.model';
import {Inventory} from '../../../models/inventory.model';
import {Table} from '../../../models/table.model';
import {TableDataStorageService} from '../../../services/table-data-storage.service';
import {PointOfSaleService} from '../../../services/point-of-sale.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  grandTotal : number;
  orderedItems: OrderedItem[] = [];
  order: Order;
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

  constructor(private pointOfSaleService: PointOfSaleService,
              private _dataStorageService: TableDataStorageService,
              private router: Router,
              private _route: ActivatedRoute) {
    this.tendered = 0;
  }

  ngOnInit() {
    this.grandTotal = this.pointOfSaleService.totalPrice;
    this._route.data.
    subscribe(
      ( data: Table[]) => {
        this.pointOfSaleService.tables = data['tables'];
      }
    );
    this.tables = this.pointOfSaleService.tables;
    this.subscription = this.pointOfSaleService.tablesChanged
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
    this.pointOfSaleService.clearOrders();
    this.pointOfSaleService.totalPrice = 0;
    this.pointOfSaleService.totalQuantity = 0;
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

    this.orderedItems = this.pointOfSaleService.orderedItems;
    for ( let i = 0; i < this.pointOfSaleService.orderedItems.length; i++) {
      this.pointOfSaleService.orderedItems[i].OrderId = orderId;

    }

    const totalPrice = this.pointOfSaleService.totalPrice;
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

    this.order = new Order(orderId, this.pointOfSaleService.orderedItems, totalPrice,
      this.tendered, this.change, dateTime , this.table,
      this.inventoryCost, this.orderProfit );
    this.pointOfSaleService.addToOrderedList(this.order);

  //  this._dataStorageService.addNewOrder(this.order).subscribe();
    this.router.navigate(['receipt']);
  }

}
